import React, { useRef, useEffect, useState } from 'react'

const imageSources = [
  '/src/assets/museums/museum-1.jpg',
  '/src/assets/museums/museum-2.jpg',
  // 必要な画像パスをここに
]

interface CanvasMergeProps {
  background: string
}

const CanvasMerge: React.FC<CanvasMergeProps> = ({ background }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const allSources = [background, ...imageSources]
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
          setMergedUrl(canvas.toDataURL('image/png'))
        }
      }
    })
  }, [background])

  const saveImage = () => {
    if (!mergedUrl) return
    const a = document.createElement('a')
    a.href = mergedUrl
    a.download = 'museum.jpg'
    a.click()
  }

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={400} />
      <button
        onClick={saveImage}
        disabled={!mergedUrl}
        className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition shadow"
      >
        完了
      </button>
      {/* {mergedUrl && <img src={mergedUrl} width={200} alt="合成プレビュー" />} */}
    </div>
  )
}

export default CanvasMerge
