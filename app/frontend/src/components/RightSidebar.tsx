//* 美術品の一覧を表示するサイドバー
import React, { useState } from "react";

interface Artwork {
  id: number;
  url: string;
  name: string;
}

//! 選択された作品IDを親に伝える
interface RightSidebarProps {
    artworks: Artwork[];
    onSelectArtwork: (id: number) => void;
    selectedArtworkId: number | null; 
}

const RightSidebar: React.FC<RightSidebarProps> = ({ artworks, onSelectArtwork, selectedArtworkId }) => (
    <div className="w-full h-full p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">美術品一覧</h3>
        <div className="grid grid-cols-2 gap-2">
            {artworks.map((artwork) => (
                <div 
                    key={artwork.id} 
                    className={`aspect-square flex items-center justify-center border rounded cursor-pointer overflow-hidden transition-all duration-150 ${
                        selectedArtworkId === artwork.id 
                            ? 'ring-4 ring-blue-500 border-blue-600 shadow-lg' // 選択中のスタイル
                            : 'bg-white hover:bg-gray-200 border-gray-300' // 通常のスタイル
                    }`} 
                    onClick={() => onSelectArtwork(artwork.id)}
                >
                    {/* ⚠️ 修正: 作品IDの代わりに画像を表示 */}
                    <img 
                        src={artwork.url} 
                        alt={artwork.name} 
                        className="w-full h-full object-cover" 
                        // 画像がロード中の代替としてIDを中央に表示
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.outerHTML = `<div class='w-full h-full flex items-center justify-center text-gray-500 text-xs bg-gray-100'>${artwork.id}</div>`;
                        }}
                    />
                </div>
            ))}
        </div>
    </div>
);
export default RightSidebar;
