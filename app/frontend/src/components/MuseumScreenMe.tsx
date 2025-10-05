import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IconContext } from 'react-icons'
import { MdOutlineEdit, MdOutlineCheck } from 'react-icons/md'
import MuseumPicture from './MuseumPicture'
import { fetchMuseumItemById, updateMuseumTitle } from '../lib/api'

const MuseumScreenMe = () => {
  const { museumId } = useParams<{ museumId: string }>()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [originalTitle, setOriginalTitle] = useState('')
  const [imageUrl, setImageUrl] = useState(
    'https://placehold.jp/eeeeee/cccccc/330x200.png?text=No%20Image',
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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
        setOriginalTitle(museum.name)
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

  // タイトル保存処理
  const handleSaveTitle = async () => {
    if (!museumId || title.trim() === '') {
      setError('タイトルを入力してください')
      return
    }

    if (title === originalTitle) {
      setIsEditing(false)
      return
    }

    try {
      setSaving(true)
      await updateMuseumTitle(parseInt(museumId), title.trim())
      setOriginalTitle(title.trim())
      setIsEditing(false)
      setError(null)
    } catch (err) {
      console.error('Failed to update title:', err)
      setError('タイトルの更新に失敗しました')
      setTitle(originalTitle) // 元のタイトルに戻す
    } finally {
      setSaving(false)
    }
  }

  // 編集キャンセル処理
  const handleCancelEdit = () => {
    setTitle(originalTitle)
    setIsEditing(false)
    setError(null)
  }

  // 編集ボタンクリック処理
  const handleEditClick = () => {
    if (isEditing) {
      handleSaveTitle()
    } else {
      setIsEditing(true)
    }
  }

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
          <a href="/show" className="text-blue-600 hover:underline">
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
          href="/show"
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
          <div className="flex justify-center items-center gap-8 mt-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
                {isEditing && (
                  <button
                    onClick={handleCancelEdit}
                    className="ml-2 text-sm underline hover:no-underline"
                  >
                    キャンセル
                  </button>
                )}
              </div>
            )}

            <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
              <input
                type="text"
                className="w-80 text-gray-800 font-bold text-2xl bg-transparent outline-none text-center placeholder-neutral-300"
                value={title}
                placeholder="タイトル"
                readOnly={!isEditing}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isEditing) {
                    handleSaveTitle()
                  } else if (e.key === 'Escape' && isEditing) {
                    handleCancelEdit()
                  }
                }}
              />
              <button
                className="ml-2 p-1 rounded font-bold text-gray-800 disabled:opacity-50"
                onClick={handleEditClick}
                disabled={saving}
              >
                <IconContext.Provider value={{ size: '1.5em' }}>
                  {saving ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
                  ) : isEditing ? (
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
