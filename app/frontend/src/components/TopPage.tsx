import React from 'react'
import { useEffect, useState } from 'react'
import { fetchMuseumItems } from '../lib/api'

// 【追加】window.location.href を使用する場合、ここに宣言
const handleNavigate = (path: string) => {
  window.location.href = path
}

const handleDoorClick = (doorId: number) => {
  handleNavigate(`/museum/${doorId}`)
}

// ドアの情報を定義する型
interface Door {
  id: number
  user_id: number
  name: string
  color: string
}

//* ドアの色作成する関数
const getRandomColor = (): string => {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 20) + 60
  const l = Math.floor(Math.random() * 20) + 75
  return `hsl(${h}, ${s}%, ${l}%)`
}

//*アプリケーションのトップページ（ドアの選択画面）コンポーネント
export default function TopPage() {
  const [doorsData, setDoorsData] = useState<Door[]>([])

  useEffect(() => {
    const loadContents = async () => {
      const contents = await fetchMuseumItems(1) // HACK: 仮のユーザーID
      // 取得したデータにランダムな色を追加
      const doorsWithColors = contents.map((item) => ({
        id: item.id,
        user_id: 1, // HACK: 仮のユーザーID
        name: item.name,
        color: getRandomColor(),
      }))
      setDoorsData(doorsWithColors)
    }
    loadContents()
  }, [])

  // 新規作成ボタンが押された時の動作
  const handleNewCreationClick = () => {
    handleNavigate('/create')
  }

  // 自分の部屋一覧ボタンが押された時の動作
  const handleMyRoomsClick = () => {
    handleNavigate('/show')
  }

  return (
    <div className="container text-center p-12">
      <div className="flex justify-between items-center mb-4 w-full max-w-[800px] mx-auto">
        <button
          onClick={handleMyRoomsClick}
          className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-colors text-sm"
        >
          自分の部屋一覧
        </button>
        <button
          onClick={handleNewCreationClick}
          className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-colors text-sm"
        >
          新規作成
        </button>
      </div>
      <div className="grid grid-cols-5 grid-rows-2 gap-2.5 max-w-[800px] mx-auto my-10">
        {doorsData.slice(0, 10).map((door) => (
          <DoorComponent key={door.id} door={door} onClick={() => handleDoorClick(door.id)} />
        ))}
      </div>
    </div>
  )
}

// ドアコンポーネントのProps型
interface DoorProps {
  door: Door
  onClick: (doorId: number) => void
}

// ドアコンポーネント
const DoorComponent: React.FC<DoorProps> = ({ door, onClick }) => {
  return (
    <div
      onClick={() => onClick(door.id)}
      className="relative w-full h-[250px] cursor-pointer select-none transition-transform duration-100 ease-in-out rounded-sm border-8 border-gray-800 shadow-md flex flex-col items-center justify-start overflow-hidden hover:scale-[1.03]"
      style={{ backgroundColor: door.color }}
    >
      {/* 内側の段差パネル */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-gray-800 shadow-inner" />

      {/* ドアハンドル */}
      <div className="absolute right-[12px] top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 border border-gray-700 rounded-full" />

      {/* ドア名ラベル */}
      <div className="absolute px-[6px] py-[3px] rounded max-w-[90%] text-ellipsis overflow-hidden whitespace-nowrap text-center bottom-[5px] left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px]">
        {door.name}
      </div>
    </div>
  )
}
