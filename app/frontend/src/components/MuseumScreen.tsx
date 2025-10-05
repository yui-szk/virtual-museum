import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MuseumPicture from './MuseumPicture'
import { fetchMuseumItemById } from '../lib/api'

const MuseumScreen = () => {
  const { museumId } = useParams<{ museumId: string }>()
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState(
    'https://placehold.jp/eeeeee/cccccc/330x200.png?text=No%20Image',
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ミュージアムデータを取得
  useEffect(() => {
    const loadMuseum = async () => {
      if (!museumId) {
        setError('ミュージアムIDが指定されていません')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const museum = await fetchMuseumItemById(parseInt(museumId))
        setTitle(museum.name)
        if (museum.imageUrl) {
          setImageUrl(museum.imageUrl)
        }
        setError(null)
      } catch (err) {
        console.error('Failed to load museum:', err)
        setError('ミュージアムの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    loadMuseum()
  }, [museumId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error && !museumId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">
            一覧へ戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="w-full max-w-6xl mx-auto pt-6 px-4">
        <a
          href="/"
          className="text-blue-600 hover:underline font-medium flex items-center gap-1"
        >
          &larr; 一覧へ戻る
        </a>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="relative bg-white rounded-lg shadow-2xs overflow-hidden">
            <div className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4 py-4 min-h-[400px]">
              <MuseumPicture imageUrl={imageUrl} />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-col items-center gap-4 mt-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
              <div className="w-80 text-gray-800 font-bold text-2xl bg-transparent outline-none text-center placeholder-neutral-300">
                {title}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MuseumScreen
