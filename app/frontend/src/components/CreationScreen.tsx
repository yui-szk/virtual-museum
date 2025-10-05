import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import {
  MdOutlineEdit,
  MdOutlineCheck,
  MdArrowBackIos,
  MdArrowForwardIos,
} from 'react-icons/md'
import RightSidebar from './RightSidebar'
import FramedArtwork from './FramedArtwork'
import bgImageUrl1 from '../assets/background/museum-back-1.jpg'
import bgImageUrl2 from '../assets/background/museum-back-2.jpg'

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

// 適当な美術品の読み込み
const artworkImageUrl =
  'https://images.metmuseum.org/CRDImages/dp/web-large/DP821127.jpg'

// 作品のダミーデータ生成
const baseIdNumber = 821127
const baseUrlPrefix = 'https://images.metmuseum.org/CRDImages/dp/web-large/DP'
const fileExtension = '.jpg'

const dummyArtworks: Artwork[] = [
  { id: 1, url: artworkImageUrl, name: '作品 1' },
  { id: 2, url: artworkImageUrl, name: '作品 2' },
  { id: 3, url: artworkImageUrl, name: '作品 3' },
  ...Array.from({ length: 7 }, (_, i) => {
    const newIdNumber = baseIdNumber + (i + 1)
    return {
      id: i + 4,
      url: `${baseUrlPrefix}${newIdNumber}${fileExtension}`,
      name: `作品 ${i + 4}`,
    }
  }),
]

const dummyBackgrounds: Background[] = [
  { id: 1, url: bgImageUrl1, name: '背景1' },
  { id: 2, url: bgImageUrl2, name: '背景2' },
]

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  backgrounds,
  onBackgroundSelect,
}) => (
  <div className="w-full h-full flex flex-col bg-white">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-semibold text-gray-800">背景一覧</h3>
    </div>
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="grid grid-cols-1 gap-3">
        {backgrounds.map((bg) => (
          <div key={bg.id} onClick={() => onBackgroundSelect(bg.url)}>
            <img
              src={bg.url}
              alt={bg.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)

type Slot = 'A' | 'B' | 'C'

export default function CreationPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [currentBackground, setCurrentBackground] = useState<string>(bgImageUrl1)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)

  const [placements, setPlacements] = useState<Record<Slot, Artwork | null>>({
    A: null,
    B: null,
    C: null,
  })

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  const handleBackgroundChange = (newUrl: string) => {
    setCurrentBackground(newUrl)
  }

  const handlePlaceArtwork = (slot: Slot) => {
    if (selectedArtwork !== null) {
      setPlacements((prev) => ({ ...prev, [slot]: selectedArtwork }))
      setSelectedArtwork(null)
    } else if (placements[slot]) {
      setPlacements((prev) => ({ ...prev, [slot]: null }))
    }
  }

  const renderSlotContent = (slot: Slot) => {
    const artwork = placements[slot]
    if (artwork) {
      return <FramedArtwork artwork={artwork} />
    }

    const isSelected = selectedArtwork !== null
    return (
      <div
        className={`flex items-center justify-center h-full w-full p-2 rounded-md transition duration-200 border-2 border-dashed ${isSelected
            ? 'bg-blue-200/90 border-blue-600 ring-2 ring-blue-500'
            : 'bg-white/70 border-gray-400 hover:bg-gray-100'
          }`}
      >
        <span className="text-sm font-bold text-gray-800">{slot}</span>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col w-full">
      {/* タイトルバー */}
      <header className="flex-shrink-0 p-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">新規作成</h1>
      </header>

      {/* メインレイアウト */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左サイドバー */}
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

        {/* 中央コンテンツ */}
        <div className="flex-1 flex flex-col items-center p-3 relative overflow-y-auto">
          {/* ギャラリー表示 */}
          <div className="relative w-full max-w-5xl aspect-video bg-gray-200 rounded-xl shadow-2xl overflow-hidden">
            <img
              src={currentBackground}
              alt="Museum Background"
              className="w-full h-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src =
                  'https://placehold.co/1200x675/990000/FFFFFF?text=Background+Load+Error'
              }}
            />

            {/* 配置スロット */}
            <div className="absolute inset-0">
              <div
                onClick={() => handlePlaceArtwork('A')}
                className="absolute flex items-center justify-center transition-all duration-200 cursor-pointer"
                style={{
                  width: '12%',
                  height: '25%',
                  top: '51%',
                  left: '22%',
                }}
              >
                {placements.A ? (
                  <FramedArtwork artwork={placements.A} />
                ) : (
                  renderSlotContent('A')
                )}
              </div>

              <div
                onClick={() => handlePlaceArtwork('B')}
                className="absolute flex items-center justify-center transition-all duration-200 cursor-pointer"
                style={{
                  width: '18%',
                  height: '26%',
                  top: '49%',
                  left: '38%',
                }}
              >
                {placements.B ? (
                  <FramedArtwork artwork={placements.B} />
                ) : (
                  renderSlotContent('B')
                )}
              </div>

              <div
                onClick={() => handlePlaceArtwork('C')}
                className="absolute flex items-center justify-center transition-all duration-200 cursor-pointer"
                style={{
                  width: '12%',
                  height: '25%',
                  top: '52%',
                  right: '29%',
                }}
              >
                {placements.C ? (
                  <FramedArtwork artwork={placements.C} />
                ) : (
                  renderSlotContent('C')
                )}
              </div>
            </div>
          </div>

          {/* タイトル入力 */}
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
        <div
          className={`relative flex-shrink-0 self-stretch transition-all duration-300 z-20 ${isRightSidebarOpen ? 'w-72 border-l border-gray-200 bg-white shadow-sm' : 'w-0'
            }`}
        >
          {isRightSidebarOpen && (
            <div className="h-full">
              <RightSidebar
                artworks={dummyArtworks}
                onSelectArtwork={setSelectedArtwork}
                selectedArtworkId={selectedArtwork?.id || null}
              />
            </div>
          )}
          <button
            className={`absolute top-16 ${isRightSidebarOpen ? 'left-0 -translate-x-full' : 'right-0'
              } bg-white hover:bg-gray-100 rounded-l-lg px-2 py-3 text-gray-600 hover:text-gray-900 
              border border-gray-200 transition-all duration-200 shadow-md z-30`}
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          >
            {isRightSidebarOpen ? <MdArrowForwardIos /> : <MdArrowBackIos />}
          </button>
        </div>

        {/* 選択中の美術品メッセージ */}
        {selectedArtwork !== null && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-base font-semibold px-4 py-2 rounded-full shadow-2xl z-50 animate-pulse">
            作品が選択されています！任意の場所をクリックして配置してください。
          </div>
        )}
      </div>
    </div>
  )
}
