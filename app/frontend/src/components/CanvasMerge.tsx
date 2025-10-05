import React, { useState, useEffect, useRef } from 'react'
import FramedArtwork from './FramedArtwork'

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

// 適当な美術品の読み込み
const artworkImageUrl = 'https://images.metmuseum.org/CRDImages/dp/web-large/DP821127.jpg'

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

type Slot = 'A' | 'B' | 'C'

interface CanvasMergeProps {
  background: string
  selectedArtworkId: number | null
}

const CanvasMerge: React.FC<CanvasMergeProps> = ({ background, selectedArtworkId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const [placements, setPlacements] = useState<Record<Slot, Artwork | null>>({
    A: null,
    B: null,
    C: null,
  })

  const handlePlaceArtwork = (slot: Slot) => {
    if (selectedArtworkId !== null) {
      const artworkToPlace = dummyArtworks.find((artwork) => artwork.id === selectedArtworkId)
      if (artworkToPlace) {
        setPlacements((prev) => ({ ...prev, [slot]: artworkToPlace }))
      }
    } else if (placements[slot]) {
      setPlacements((prev) => ({ ...prev, [slot]: null }))
    }
  }

  const renderSlotContent = (slot: Slot) => {
    const artwork = placements[slot]
    if (artwork) {
      return <FramedArtwork artwork={artwork} />
    }

    const isSelected = selectedArtworkId !== null
    return (
      <div
        className={`flex items-center justify-center h-full w-full p-2 rounded-md transition duration-200 border-2 border-dashed ${
          isSelected
            ? 'bg-blue-200/90 border-blue-600 ring-2 ring-blue-500'
            : 'bg-white/70 border-gray-400 hover:bg-gray-100'
        }`}
      >
        <span className="text-sm font-bold text-gray-800">{slot}</span>
      </div>
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const allSources = [background]
    const imgs: HTMLImageElement[] = []
    let loaded = 0

    allSources.forEach((src, idx) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      img.onload = () => {
        imgs[idx] = img
        loaded++
        if (loaded === allSources.length) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          imgs.forEach((i) => ctx.drawImage(i, 0, 0, canvas.width, canvas.height))

          // placementsのA/B/C画像もcanvasに合成
          const slotConfigs: Record<
            Slot,
            { left: number; top: number; width: number; height: number }
          > = {
            A: { left: 0.22, top: 0.51, width: 0.12, height: 0.2 },
            B: { left: 0.38, top: 0.49, width: 0.18, height: 0.23 },
            C: { left: 0.59, top: 0.52, width: 0.12, height: 0.2 }, // right:29%から計算
          }
          ;(['A', 'B', 'C'] as Slot[]).forEach((slot: Slot) => {
            const artwork = placements[slot]
            if (artwork) {
              const img = new window.Image()
              img.crossOrigin = 'anonymous'
              img.src = artwork.url
              img.onload = () => {
                const cfg = slotConfigs[slot]
                const x = canvas.width * cfg.left
                const y = canvas.height * cfg.top
                const w = canvas.width * cfg.width
                const h = canvas.height * cfg.height
                ctx.drawImage(img, x, y, w, h)
                setMergedUrl(canvas.toDataURL('image/png'))
              }
            }
          })
          // placements画像がなければ背景のみ保存
          if (!placements.A && !placements.B && !placements.C) {
            setMergedUrl(canvas.toDataURL('image/png'))
          }
        }
      }
    })
  }, [background, placements])

  const saveImage = () => {
    if (!mergedUrl) return
    const a = document.createElement('a')
    a.href = mergedUrl
    a.download = 'museum.jpg'
    a.click()

    window.location.href = '/show'
  }

  return (
    <div className="flex flex-col items-center w-full my-4">
      <div className="relative w-[850px] h-[550px] rounded-md overflow-hidden bg-white">
        <canvas ref={canvasRef} width={850} height={550} />
        <div className="absolute inset-0">
          <div
            onClick={() => handlePlaceArtwork('A')}
            className="absolute flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              width: '12%',
              height: '20%',
              top: '51%',
              left: '22%',
            }}
          >
            {placements.A ? <FramedArtwork artwork={placements.A} /> : renderSlotContent('A')}
          </div>

          <div
            onClick={() => handlePlaceArtwork('B')}
            className="absolute flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              width: '18%',
              height: '23%',
              top: '49%',
              left: '38%',
            }}
          >
            {placements.B ? <FramedArtwork artwork={placements.B} /> : renderSlotContent('B')}
          </div>

          <div
            onClick={() => handlePlaceArtwork('C')}
            className="absolute flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              width: '12%',
              height: '20%',
              top: '52%',
              right: '29%',
            }}
          >
            {placements.C ? <FramedArtwork artwork={placements.C} /> : renderSlotContent('C')}
          </div>
        </div>
      </div>
      <button
        onClick={saveImage}
        disabled={!mergedUrl}
        className="px-4 py-3 mt-24 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition shadow"
      >
        完了
      </button>
      {/* {mergedUrl && <img src={mergedUrl} width={200} alt="合成プレビュー" />} */}
    </div>
  )
}

export default CanvasMerge
