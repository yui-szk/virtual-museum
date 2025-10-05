import React, { useState, useEffect } from 'react'
import MuseumPicture from './MuseumPicture'
import { fetchMuseumItemById } from '../lib/api'

const MuseumScreen = () => {
  const [title, setTitle] = useState('美術館のタイトル')
  const [imageUrl, setImageUrl] = useState(
    'https://placehold.jp/eeeeee/cccccc/330x200.png?text=No%20Image',
  )

  useEffect(() => {
    const loadContents = async () => {
      const pathParts = window.location.pathname.split('/')
      const museumId = Number(pathParts[pathParts.indexOf('museum') + 1])
      if (museumId) {
        const contents = await fetchMuseumItemById(museumId)
        setTitle(contents.name)
        setImageUrl(
          contents.imageUrl && contents.imageUrl.startsWith('http')
            ? contents.imageUrl
            : 'https://placehold.jp/eeeeee/cccccc/330x200.png?text=No%20Image',
        )
      }
    }
    loadContents()
  }, [])

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="w-full max-w-6xl mx-auto pt-6 px-4">
        <a href="/" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
          &larr; 一覧へ戻る
        </a>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Gallery Room Image */}
          <div className="relative bg-white rounded-lg shadow-2xs overflow-hidden">
            {/* Gallery Wall with Frames */}
            <div className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4 py-4 min-h-[400px]">
              <MuseumPicture imageUrl={imageUrl} />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex justify-center items-center gap-8 mt-4">
            <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
              <p className="w-80 text-gray-800 font-bold text-2xl bg-transparent outline-none text-center placeholder-neutral-300">
                {title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MuseumScreen
