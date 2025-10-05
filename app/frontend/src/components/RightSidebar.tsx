//* 美術品の一覧を表示するサイドバー
import React, { useState } from 'react'
import { searchArtworks, fetchMetObject } from '../lib/api'

interface Artwork {
  id: number
  url: string
  name: string
}

interface SearchedArtwork {
  id: number
  url: string
  name: string
}

//! 選択された作品情報を親に伝える
interface RightSidebarProps {
  artworks: Artwork[]
  onSelectArtwork: (artwork: Artwork) => void
  selectedArtworkId: number | null
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  artworks,
  onSelectArtwork,
  selectedArtworkId,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchedArtwork[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // 検索処理
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false)
      return
    }

    try {
      setIsSearching(true)

      // 検索クエリに基づいて検索パラメータを決定
      const query = searchQuery.trim().toLowerCase()
      let searchParams: any = { limit: 20 }

      // 年代での検索（数字が含まれている場合）
      const yearMatch = query.match(/\d{4}/)
      if (yearMatch) {
        searchParams.objectDate = yearMatch[0]
      }

      // 画材での検索（特定のキーワードが含まれている場合）
      if (query.includes('oil') || query.includes('オイル')) {
        searchParams.medium = 'Oil'
      } else if (query.includes('watercolor') || query.includes('水彩')) {
        searchParams.medium = 'Watercolor'
      } else if (query.includes('drawing') || query.includes('ドローイング')) {
        searchParams.medium = 'Drawing'
      }

      // 都市での検索
      if (query.includes('paris') || query.includes('パリ')) {
        searchParams.city = 'Paris'
      } else if (query.includes('new york') || query.includes('ニューヨーク')) {
        searchParams.city = 'New York'
      } else if (query.includes('london') || query.includes('ロンドン')) {
        searchParams.city = 'London'
      }

      // 特定の条件がない場合はハイライト作品を検索
      if (!searchParams.objectDate && !searchParams.medium && !searchParams.city) {
        searchParams.isHighlight = true
      }

      const searchResponse = await searchArtworks(searchParams)

      if (searchResponse.objectIDs && searchResponse.objectIDs.length > 0) {
        const artworkPromises = searchResponse.objectIDs.slice(0, 10).map(async (id) => {
          try {
            const artwork = await fetchMetObject(id)
            return {
              id: artwork.objectID,
              url: artwork.primaryImageSmall || '',
              name: artwork.title || 'Untitled'
            }
          } catch (error) {
            return null
          }
        })

        const artworks = await Promise.all(artworkPromises)
        const validArtworks = artworks.filter((artwork): artwork is SearchedArtwork =>
          artwork !== null && Boolean(artwork.url)
        )

        setSearchResults(validArtworks)
        setShowSearchResults(true)
      } else {
        setSearchResults([])
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  const displayArtworks = showSearchResults ? searchResults : artworks

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">美術品一覧</h3>
        <input
          type="text"
          placeholder="年代(1800)、画材(Oil)、都市(Paris)で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSearching ? '検索中...' : '検索'}
          </button>
          {showSearchResults && (
            <button
              onClick={clearSearch}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              クリア
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {displayArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${selectedArtworkId === artwork.id
                ? 'ring-4 ring-blue-500 shadow-lg scale-[0.98]'
                : 'ring-2 ring-gray-200 hover:ring-blue-300 hover:shadow-md'
                }`}
              onClick={() => onSelectArtwork(artwork)}
            >
              <img
                src={artwork.url || '/placeholder.svg'}
                alt={artwork.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.outerHTML = `<div class='w-full h-full flex items-center justify-center text-gray-500 text-xs bg-gray-50'>${artwork.id}</div>`
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RightSidebar
