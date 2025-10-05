import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { MdOutlineEdit, MdOutlineCheck } from 'react-icons/md'
import MuseumPicture from './MuseumPicture'

const MuseumScreenMe = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState(
    'https://placehold.jp/eeeeee/cccccc/330x200.png?text=No%20Image',
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="w-full max-w-6xl mx-auto pt-6 px-4">
        <a href="/" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
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
          <div className="flex justify-center items-center gap-8 mt-4">
            <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
              <input
                type="text"
                className="w-80 text-gray-800 font-bold text-2xl bg-transparent outline-none text-center placeholder-neutral-300"
                value={title}
                placeholder="タイトル"
                readOnly={!isEditing}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                className="ml-2 p-1 rounded font-bold text-gray-800"
                onClick={() => setIsEditing(!isEditing)}
              >
                <IconContext.Provider value={{ size: '1.5em' }}>
                  {isEditing ? (
                    <span role="img" aria-label="save">
                      <MdOutlineCheck />
                    </span>
                  ) : (
                    <span role="img" aria-label="edit">
                      <MdOutlineEdit />
                    </span>
                  )}
                </IconContext.Provider>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MuseumScreenMe
