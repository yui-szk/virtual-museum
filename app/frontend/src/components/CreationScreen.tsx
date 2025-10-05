import React, { useState } from 'react'

import { IconContext } from 'react-icons'
import { MdOutlineEdit, MdOutlineCheck, MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'
import RightSidebar from './RightSidebar'
//! 背景画像のインポート（仮）
import bgImageUrl1 from '../assets/background/museum-back-1.jpg'
import bgImageUrl2 from '../assets//background/museum-back-2.jpg'

const bgImageUrl: string = bgImageUrl1 // 初期背景画像

interface Artwork {
  id: number
  url: string
  name: string
}

interface Background {
  id: number
  url: string
  name: string
}

interface LeftSidebarProps {
  backgrounds: Background[]

  onBackgroundSelect: (url: string) => void
}

//! 適当な美術品の読み込み
const artworkImageUrl = 'https://images.metmuseum.org/CRDImages/dp/web-large/DP821127.jpg'

// 1. ベースID (821127) を数値として取得
const baseIdNumber = 821127
const baseUrlPrefix = 'https://images.metmuseum.org/CRDImages/dp/web-large/DP'
const fileExtension = '.jpg'

const dummyArtworks = [
  { id: 1, url: artworkImageUrl, name: '作品 1' },
  { id: 2, url: artworkImageUrl, name: '作品 2' },
  { id: 3, url: artworkImageUrl, name: '作品 3' },
  // 残りの作品
  ...Array.from({ length: 7 }, (_, i) => {
    // iは0から始まる
    // 作品4 (i=0) は 821127 + (0 + 1) = 821128
    // 作品5 (i=1) は 821127 + (1 + 1) = 821129
    // 作品6 (i=2) は 821127 + (2 + 1) = 821130  <-- ここで桁が増えても正しく処理される
    const newIdNumber = baseIdNumber + (i + 1)

    return {
      id: i + 4,
      // プレフィックス、新しい数値ID、拡張子を結合して正しいURLを生成
      url: `${baseUrlPrefix}${newIdNumber}${fileExtension}`,
      name: `作品 ${i + 4}`,
    }
  }),
]

// 背景画像の読み込み
const dummyBackgrounds: Background[] = [
  { id: 1, url: bgImageUrl1, name: '背景1' },
  { id: 2, url: bgImageUrl2, name: '背景2' },
]

const LeftSidebar: React.FC<LeftSidebarProps> = ({ backgrounds, onBackgroundSelect }) => (
  <div className="w-full h-full flex flex-col bg-white">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-semibold text-gray-800">背景一覧</h3>
    </div>
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="grid grid-cols-1 gap-3">
        {backgrounds.map((bg) => (
          <div key={bg.id} onClick={() => onBackgroundSelect(bg.url)}>
            <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function CreationPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [currentBackground, setCurrentBackground] = useState<string>(bgImageUrl)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)

  // 新しく追加
  const [selectedArtworkId, setSelectedArtworkId] = useState<number | null>(null)
  const [placements, setPlacements] = useState<{
    A: number | null
    B: number | null
    C: number | null
  }>({
    A: null,
    B: null,
    C: null,
  })

  const handleBackgroundChange = (newUrl: string) => {
    setCurrentBackground(newUrl)
  }

  const handlePlaceArtwork = (slot: 'A' | 'B' | 'C') => {
    if (selectedArtworkId !== null) {
      setPlacements((prev) => ({ ...prev, [slot]: selectedArtworkId }))
      setSelectedArtworkId(null) // 配置後に選択解除したい場合
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col w-full">
      {/* 画面タイトル */}
      <header className="flex-shrink-0 p-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">新規作成</h1>
      </header>

      {/* メインレイアウト */}
      <div className="flex flex-1 overflow-hidden">
        {isLeftSidebarOpen && (
          <div className="relative w-64 bg-white border-r border-gray-200 flex-shrink-0 shadow-sm transition-all duration-300 z-20">
            <button
              className="absolute top-4 right-0 translate-x-full bg-white hover:bg-gray-50 rounded-r-lg px-2 py-3 text-gray-600 hover:text-gray-900 border border-l-0 border-gray-200 transition-all duration-200 z-10"
              onClick={() => setIsLeftSidebarOpen(false)}
            >
              <MdArrowBackIos />
            </button>

            <LeftSidebar
              backgrounds={dummyBackgrounds}
              onBackgroundSelect={handleBackgroundChange}
            />
          </div>
        )}

        {!isLeftSidebarOpen && (
          <button
            className="absolute top-16 left-0 bg-white hover:bg-gray-50 rounded-r-lg px-2 py-3 text-gray-600 hover:text-gray-900 shadow-md border border-l-0 border-gray-200 transition-all duration-200 z-30"
            onClick={() => setIsLeftSidebarOpen(true)}
          >
            <MdArrowForwardIos />
          </button>
        )}

        {/* 中央 */}
        <div className="flex-1 flex flex-col items-center p-3 relative overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="relative w-full overflow-hidden flex justify-center items-center aspect-video">
            <img
              src={currentBackground}
              alt="Museum Background"
              className="w-full h-full object-contain"
            />

            {/* 配置スロット (A, B, C) - Adjusted for image alignment */}
            <div className="absolute inset-0">
              <div
                onClick={() => handlePlaceArtwork('A')}
                className="absolute top-[15%] left-[17%] w-[20%] h-[40%] flex items-center justify-center bg-white/70 rounded cursor-pointer"
                style={{
                  // More precise positioning relative to the left artwork
                  width: '7%',
                  height: '17%',
                  top: '51%',
                  left: '31%',
                }}
              >
                {placements['A'] ?? 'A'}
              </div>
              {/* Slot B: Positioned over the center largest artwork */}
              <div
                onClick={() => handlePlaceArtwork('B')}
                className="absolute top-[10%] left-[40%] w-[25%] h-[50%] flex items-center justify-center bg-white/70 rounded cursor-pointer"
                style={{
                  // More precise positioning relative to the center artwork
                  width: '12%',
                  height: '20%',
                  top: '49%',
                  left: '42%',
                }}
              >
                {placements['B'] ?? 'B'}
              </div>
              {/* Slot C: Positioned over the right inner artwork */}
              <div
                onClick={() => handlePlaceArtwork('C')}
                className="absolute top-[15%] right-[10%] w-[25%] h-[40%] flex items-center justify-center bg-white/70 rounded cursor-pointer"
                style={{
                  // More precise positioning relative to the right artwork
                  width: '8%',
                  height: '16%',
                  top: '52%',
                  right: '34.5%',
                }}
              >
                {placements['C'] ?? 'C'}
              </div>
            </div>
          </div>
          {/* タイトル入力欄 */}
          <div className="flex justify-between items-center w-full max-w-xl mt-4 mb-4">
            <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-300 rounded-md hover:bg-gray-400 transition shadow">
              戻る
            </button>
            <div className="p-2 bg-white rounded-md shadow flex items-center gap-2">
              <input
                type="text"
                className="w-60 text-gray-800 font-medium text-lg bg-transparent outline-none text-center placeholder-gray-400"
                value={title}
                placeholder="タイトル"
                readOnly={!isEditing}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                className="p-1 rounded font-bold text-gray-800"
                onClick={() => setIsEditing(!isEditing)}
              >
                <IconContext.Provider value={{ size: '1.5em' }}>
                  {isEditing ? <MdOutlineCheck /> : <MdOutlineEdit />}
                </IconContext.Provider>
              </button>
            </div>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition shadow">
              完了
            </button>
          </div>
        </div>

        {/* 右サイドバー */}
        {isRightSidebarOpen && (
          <div className="relative w-72 bg-white border-l border-gray-200 flex-shrink-0 shadow-lg transition-all duration-300">
            <button
              className="absolute top-4 left-0 -translate-x-full bg-white hover:bg-gray-50 rounded-l-lg px-2 py-3 text-gray-600 hover:text-gray-900 shadow-md border border-r-0 border-gray-200 transition-all duration-200"
              onClick={() => setIsRightSidebarOpen(false)}
            >
              <MdArrowForwardIos />
            </button>

            <RightSidebar
              artworks={dummyArtworks}
              onSelectArtwork={setSelectedArtworkId}
              selectedArtworkId={selectedArtworkId}
            />
          </div>
        )}

        {!isRightSidebarOpen && (
          <button
            className="absolute top-16 right-0 bg-white hover:bg-gray-50 rounded-l-lg px-2 py-3 text-gray-600 hover:text-gray-900 shadow-md border border-r-0 border-gray-200 transition-all duration-200"
            onClick={() => setIsRightSidebarOpen(true)}
          >
            <MdArrowBackIos />
          </button>
        )}
      </div>
    </div>
  )
}
