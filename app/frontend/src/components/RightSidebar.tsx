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
    // 選択中の作品をハイライトするためのプロパティ
    selectedArtworkId: number | null; 
}
const RightSidebar: React.FC<RightSidebarProps> = ({ artworks, onSelectArtwork, selectedArtworkId }) => (
    <div className="w-full h-full p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">美術館一覧</h3>
        <div className="grid grid-cols-2 gap-2">
            {artworks.map((artwork) => (
                <div 
                    key={artwork.id} 
                    className={`aspect-square flex items-center justify-center border rounded cursor-pointer transition-colors ${
                        selectedArtworkId === artwork.id 
                            ? 'bg-blue-500 text-white border-blue-600 shadow-lg' // 選択中のスタイル
                            : 'bg-white text-gray-800 hover:bg-gray-200 border-gray-300' // 通常のスタイル
                    }`} 
                    onClick={() => onSelectArtwork(artwork.id)}
                >
                    {artwork.id}
                </div>
            ))}
        </div>
    </div>
);
export default RightSidebar;
