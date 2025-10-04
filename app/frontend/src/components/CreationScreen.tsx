import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";
import RightSidebar from "./RightSidebar"; // 新しく分離したコンポーネントをインポート

import museumRoom from "../assets/museum-sample.jpg";

const bgImageUrl: string = museumRoom;

interface Artwork {
  id: number;
  url: string;
  name: string;
}

interface Background {
  id: number;
  url: string;
  name: string;
}

interface LeftSidebarProps {
  backgrounds: Background[];
  onBackgroundSelect: (url: string) => void;
}

const dummyArtworks: Artwork[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  url: `https://placehold.co/100x100/F0F0F0/000000?text=作品+${i+1}`,
  name: `作品 ${i + 1}`,
}));

const dummyBackgrounds: Background[] = [
  { id: 1, url: bgImageUrl, name: '背景1' },
  { id: 2, url: bgImageUrl, name: '背景2' },
];

const LeftSidebar: React.FC<LeftSidebarProps> = ({ backgrounds, onBackgroundSelect }) => (
  <div className="w-40 flex-shrink-0 bg-gray-100 border-r border-gray-300 overflow-y-auto p-2">
    <h3 className="text-sm font-semibold mb-1 text-gray-700">背景</h3>
    <div className="space-y-4">
      {backgrounds.map((bg) => (
        <div key={bg.id} className="cursor-pointer" onClick={() => onBackgroundSelect(bg.url)}>
          <p className="text-xs text-gray-600 mb-1">{bg.name}</p>
          <div className="w-full h-16 border border-gray-400 rounded-sm overflow-hidden shadow-sm">
            <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function CreationPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [currentBackground, setCurrentBackground] = useState<string>(bgImageUrl);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true); // ← 開閉状態を管理

  const handleBackgroundChange = (newUrl: string) => {
    setCurrentBackground(newUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">

      {/* 画面タイトル */}
      <header className="flex-shrink-0 p-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">新規作成</h1>
      </header>

      {/* メインレイアウト */}
      <main className="flex flex-1 overflow-hidden">
        {/* 左サイドバー */}
        <LeftSidebar
          backgrounds={dummyBackgrounds}
          onBackgroundSelect={handleBackgroundChange}
        />

        {/* 中央 */}
        <div className="flex-1 flex flex-col items-center p-3 relative overflow-y-auto bg-gray-200">
          <div className="relative w-full overflow-hidden flex justify-center items-center aspect-video">
            <img
              src={currentBackground}
              alt="Museum Background"
              className="w-full h-full object-contain"
            />
          </div>

          {/* タイトル入力欄 */}
          <div className="flex justify-between items-end w-full max-w-xl mt-4 mb-4">
            <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-300 rounded-md hover:bg-gray-400 transition shadow">
              戻る
            </button>
            <div className="p-2 bg-white rounded-md shadow flex items-center gap-2">
              <input
                type="text"
                className="w-60 text-gray-800 font-medium text-lg bg-transparent outline-none text-center placeholder-gray-400"
                value={title}
                placeholder='タイトル'
                readOnly={!isEditing}
                onChange={e => setTitle(e.target.value)}
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

{/* 右サイドバー（トグル付き） */}
{isRightSidebarOpen && (
  <div className="relative w-64 bg-gray-100 border-l border-gray-300 flex-shrink-0 transition-all duration-300">
    {/* トグルボタン */}
    <button
      className="absolute top-2 left-0 -translate-x-full bg-gray-200 hover:bg-gray-300 rounded-r px-1 py-0.5 text-gray-700 shadow"
      onClick={() => setIsRightSidebarOpen(false)}
    >
      ＞
    </button>

    {/* 中身 */}
    <RightSidebar artworks={dummyArtworks} />
  </div>
)}

{!isRightSidebarOpen && (
  <button
    className="absolute top-20 right-0 bg-gray-200 hover:bg-gray-300 rounded-l px-1 py-0.5 text-gray-700 shadow"
    onClick={() => setIsRightSidebarOpen(true)}
  >
    ＜
  </button>
)}

      </main>
    </div>
  );
}
