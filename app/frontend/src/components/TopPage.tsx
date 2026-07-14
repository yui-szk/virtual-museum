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

// ギャラリー調のドア色パレット。id から決定的に選ぶことで再描画しても色が変わらない
const DOOR_PALETTE = [
  '#41513f', // 深緑
  '#5a3535', // オックスブラッド
  '#4a3728', // ウォルナット
  '#3a4458', // スレートブルー
  '#463349', // オーベルジーン
  '#2f4a4d', // ダークティール
] as const

const doorColorForId = (id: number): string => DOOR_PALETTE[Math.abs(id) % DOOR_PALETTE.length]

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
      // 取得したデータに id から決まる色を付与
      const doorsWithColors = museums.map((museum) => ({
        id: museum.id,
        user_id: museum.userId,
        name: museum.name,
        color: doorColorForId(museum.id),
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
                  <div className="aspect-[5/8] animate-pulse rounded-[2px] border border-white/5 bg-ink-700/50" />
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
const DOOR_GRID_CLASS =
  'mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5'

// ドアコンポーネントのProps型
interface DoorProps {
  door: Door
  onClick: (doorId: number) => void
}

// ドアコンポーネント
const DoorComponent: React.FC<DoorProps> = ({ door, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(door.id)}
      aria-label={`${door.name} の美術館に入る`}
      className="group block w-full cursor-pointer select-none perspective-[900px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-400"
    >
      {/* 戸口: 枠と、開いたときに見える内部の暗がり */}
      <div className="relative aspect-[5/8] rounded-[2px] border-[6px] border-[#241c12] shadow-[0_12px_28px_rgba(0,0,0,0.55)] ring-1 ring-brass-500/30">
        <div className="absolute inset-0 bg-ink-950" />
        {/* 開いたときに漏れる金色の光 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,213,163,0.4),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />

        {/* ドア本体（左ヒンジで開く） */}
        <div
          className="absolute inset-0 origin-left transform-3d transition-transform duration-500 ease-out group-hover:rotate-y-[-30deg] group-focus-visible:rotate-y-[-30deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-y-0 motion-reduce:group-focus-visible:rotate-y-0"
          style={{ backgroundColor: door.color }}
        >
          {/* 上から下への僅かな明暗（木の質感） */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25" />
          {/* 上長・下短の鏡板 */}
          <div className="absolute left-[14%] right-[14%] top-[8%] h-[46%] border border-black/30 bg-white/[0.04] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.35)]" />
          <div className="absolute bottom-[8%] left-[14%] right-[14%] h-[30%] border border-black/30 bg-white/[0.04] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.35)]" />
          {/* 真鍮ハンドル */}
          <div className="absolute right-[9%] top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-gradient-to-br from-brass-300 to-brass-500 shadow-[0_1px_3px_rgba(0,0,0,0.6)] sm:size-3" />
        </div>
      </div>

      {/* 真鍮ネームプレート */}
      <div
        className="mx-auto mt-3 w-fit max-w-full truncate rounded-[2px] bg-gradient-to-b from-brass-300 to-brass-500 px-3 py-1 text-center font-serif-jp text-[11px] tracking-wide text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.4)] sm:text-xs"
        title={door.name}
      >
        {door.name}
      </div>
    </button>
  )
}
