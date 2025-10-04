//* 美術品の一覧を表示するサイドバー
import React, { useState } from "react";

interface Artwork {
  id: number;
  url: string;
  name: string;
}

interface RightSidebarProps {
  artworks: Artwork[];
  onSelectArtwork: (id: number) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ artworks }) => {
  const [isOpen, setIsOpen] = useState(true); // ← サイドバー内部で状態管理

  return (
    <div className="w-64 flex-shrink-0 bg-gray-100 border-l border-gray-300 overflow-y-auto">
      <div className="flex justify-between items-center p-2 border-b border-gray-300 bg-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">美術品一覧</h3>
        
      </div>

      {/* 一覧部分：isOpen の状態で表示切替 */}
      {isOpen && (
        <div className="grid grid-cols-2 gap-1 p-1">
          {artworks.map((art) => (
            <div
              key={art.id}
              className="aspect-square bg-white border border-gray-400 cursor-grab rounded-sm overflow-hidden shadow-sm flex items-center justify-center text-xs"
            >
              {art.id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
