//* 美術品の一覧を表示するサイドバー
import React, { useState } from 'react'

interface Artwork {
  id: number
  url: string
  name: string
}

//! 選択された作品IDを親に伝える
interface RightSidebarProps {
  artworks: Artwork[]
  onSelectArtwork: (id: number) => void
  selectedArtworkId: number | null
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  artworks,
  onSelectArtwork,
  selectedArtworkId,
}) => (
  <div className="w-full h-full flex flex-col bg-white">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-semibold text-gray-800">美術品一覧</h3>
    </div>
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedArtworkId === artwork.id
                ? 'ring-4 ring-blue-500 shadow-lg scale-[0.98]'
                : 'ring-2 ring-gray-200 hover:ring-blue-300 hover:shadow-md'
            }`}
            onClick={() => onSelectArtwork(artwork.id)}
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

export default RightSidebar
