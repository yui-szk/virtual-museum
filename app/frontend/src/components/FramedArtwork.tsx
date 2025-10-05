//* 美術品を囲む額縁
import React, { useState } from 'react'

interface Artwork {
  id: number
  url: string
  name: string
}

// 額縁付きの作品コンポーネント
const FramedArtwork: React.FC<{ artwork: Artwork }> = ({ artwork }) => {
  return (
    <div className="inline-block bg-white p-1 shadow-xl rounded-sm border-8 border-[#827820]">
      <img
        src={artwork.url}
        alt={artwork.name}
        className="block max-h-[100%] max-w-[100%] object-contain"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = 'https://placehold.co/200x200/990000/FFFFFF?text=Load+Error'
        }}
      />
    </div>
  )
}

export default FramedArtwork
