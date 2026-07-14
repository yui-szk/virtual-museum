import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineDoorFront } from 'react-icons/md'
import { fetchPublicMuseums } from '../lib/api'

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
  const navigate = useNavigate()
  // null はロード中を表す
  const [doorsData, setDoorsData] = useState<Door[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadContents = async () => {
    setDoorsData(null)
    setError(null)
    try {
      const museums = await fetchPublicMuseums(1) // HACK: 仮のユーザーID
      // 取得したデータにランダムな色を追加
      const doorsWithColors = museums.map((museum) => ({
        id: museum.id,
        user_id: museum.userId,
        name: museum.name,
        color: getRandomColor(),
      }))
      setDoorsData(doorsWithColors)
    } catch (err) {
      console.error('美術館一覧の取得に失敗しました', err)
      setError('美術館の一覧を取得できませんでした')
    }
  }

  useEffect(() => {
    loadContents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ドアが押された時の動作
  const handleDoorClick = (doorId: number) => {
    navigate(`/museum/${doorId}`)
  }

  // 新規作成ボタンが押された時の動作
  const handleNewCreationClick = () => {
    navigate('/create')
  }

  // 自分の部屋一覧ボタンが押された時の動作
  const handleMyRoomsClick = () => {
    navigate('/show')
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-ink-800 via-ink-900 to-ink-950">
      <div className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <button onClick={handleMyRoomsClick} className={NAV_BUTTON_CLASS}>
            自分の部屋一覧
          </button>
          <button onClick={handleNewCreationClick} className={NAV_BUTTON_CLASS}>
            新規作成
          </button>
        </header>

        {/* ヒーロー領域 */}
        <section className="pt-10 pb-12 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-brass-400">Virtual Museum</p>
          <h1 className="mt-3 font-serif-jp text-4xl tracking-wide text-parchment sm:text-5xl">
            バーチャル美術館
          </h1>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-brass-400 to-transparent" />
          <p className="mt-4 font-serif-jp text-sm text-parchment/60 sm:text-base">
            扉を開けて、誰かの美術館へ
          </p>
        </section>

        <main className="pb-12">
          {error ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-10 text-center">
              <p className="font-serif-jp text-lg text-parchment">{error}</p>
              <button onClick={loadContents} className={NAV_BUTTON_CLASS}>
                再試行
              </button>
            </div>
          ) : doorsData === null ? (
            <div className={DOOR_GRID_CLASS} role="status" aria-label="美術館を読み込み中">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i}>
                  <div className="h-[250px] animate-pulse rounded-sm border border-white/5 bg-ink-700/50" />
                  <div className="mx-auto mt-3 h-5 w-2/3 animate-pulse rounded-[2px] bg-ink-700/50" />
                </div>
              ))}
            </div>
          ) : doorsData.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-10 text-center">
              <MdOutlineDoorFront aria-hidden className="text-5xl text-brass-400/60" />
              <p className="font-serif-jp text-lg text-parchment">
                まだ公開されている美術館がありません
              </p>
              <p className="text-sm text-parchment/50">最初の扉を、あなたが作りませんか</p>
              <button
                onClick={handleNewCreationClick}
                className="mt-2 rounded-sm bg-brass-400 px-5 py-2 font-serif-jp text-sm tracking-wider text-ink-900 transition-colors hover:bg-brass-300"
              >
                美術館を作る
              </button>
            </div>
          ) : (
            <div className={DOOR_GRID_CLASS}>
              {doorsData.slice(0, 10).map((door) => (
                <DoorComponent key={door.id} door={door} onClick={() => handleDoorClick(door.id)} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// 真鍮のアウトライン調ナビボタン
const NAV_BUTTON_CLASS =
  'rounded-sm border border-brass-400/40 px-4 py-2 font-serif-jp text-sm tracking-wider text-brass-300 transition-colors hover:border-brass-400 hover:bg-brass-400/10'

// ドアグリッド（スケルトンと実表示でレイアウトを揃えるため共有）
const DOOR_GRID_CLASS = 'grid grid-cols-5 grid-rows-2 gap-2.5 max-w-[800px] mx-auto'

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
