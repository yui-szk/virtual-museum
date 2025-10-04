import React, { useState } from 'react';
// アイコンとコンテキストをインポート
import { IconContext } from 'react-icons'
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";
// ギャラリーの画像コンポーネントをインポート
import MuseumPicture from './MuseumPicture';

// 画像をJavaScriptモジュールとしてインポートする (パスは適切に修正済みと仮定)
import museumRoom from "../assets/museum-sample.jpg" 

const bgImageUrl: string = museumRoom; 

//* 美術品（将来的にAPIから取得）
interface Artwork {
  id: number;
  url: string;
  name: string;
}
//* 背景（将来的にAPIから取得）
interface Background {
  id: number;
  url: string;
  name: string;
}
interface Background {
  id: number;
  url: string;
  name: string;
}

// 🚨 修正点 1: 新しいプロパティ 'onBackgroundSelect' の型を定義
interface LeftSidebarProps {
  backgrounds: Background[];
  onBackgroundSelect: (url: string) => void; // URLを受け取る関数
}

// ダミーデータ（右サイドバー用）
const dummyArtworks: Artwork[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  url: `https://placehold.co/100x100/F0F0F0/000000?text=作品+${i+1}`, 
  name: `作品 ${i + 1}`,
}));

// ダミーの背景データ（左サイドバー用）
const dummyBackgrounds: Background[] = [
  { id: 1, url: bgImageUrl, name: '背景1' }, 
  { id: 2, url: bgImageUrl, name: '背景2' }, 
];


//! 右側の美術品リストコンポーネント (要変更）
const RightSidebar: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => (
  // ... (RightSidebar のコードは変更なし)
  <div className="w-64 flex-shrink-0 bg-gray-100 border-l border-gray-300 overflow-y-auto p-2">
    <h3 className="text-sm font-semibold mb-2 text-gray-700">美術品一覧</h3>
    <div className="grid grid-cols-2 gap-2">
      {artworks.map((art) => (
        <div 
          key={art.id} 
          className="aspect-square bg-white border border-gray-400 cursor-grab rounded-sm overflow-hidden shadow-sm"
        >
          <img src={art.url} alt={art.name} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  </div>
);

//* 左側の背景リストコンポーネント
const LeftSidebar: React.FC<{ backgrounds: Background[] }> = ({ backgrounds }) => (
  <div className="w-40 flex-shrink-0 bg-gray-100 border-r border-gray-300 overflow-y-auto p-2">
    <h3 className="text-sm font-semibold mb-2 text-gray-700">背景</h3>
    <div className="space-y-2">
      {backgrounds.map((bg) => (
        <div key={bg.id} className="cursor-pointer">
          <p className="text-xs text-gray-600 mb-1">{bg.name}</p>
          <div className="w-full h-16 border border-gray-400 rounded-sm overflow-hidden shadow-sm">
            <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
          </div>
        </div>
      ))}
    </div>
  </div>
);


//* メインの作成画面コンポーネント
export default function CreationPage() {
  // MuseumScreenから移植したロジック
  const [isEditing, setIsEditing] = useState(false); // タイトル編集の状態
  const [title, setTitle] = useState(''); // タイトル
  const [currentBackground, setCurrentBackground] = useState<string>(bgImageUrl); // 背景URL
  
  //! 背景変更ハンドラー関数を定義
  // 左バーの背景を押したら真ん中の画像のURLを変更する
  const handleBackgroundChange = (newUrl: string) => {
    setCurrentBackground(newUrl);
  };
  return (
    // 画面全体を覆うコンテナ (Flexboxを適用)
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* 画面タイトル */}
      <header className="flex-shrink-0 p-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">新規作成</h1>
      </header>

      {/* メインレイアウト: 左サイドバー + 中央 + 右サイドバー */}
      <main className="flex flex-1 overflow-hidden">
        
      {/* 左サイドバー: 背景画像一覧 */}
      <LeftSidebar 
        backgrounds={dummyBackgrounds} 
        onBackgroundSelect={handleBackgroundChange} // ← この行を追加
      />
        {/* -------------------------------------------------------------------------- */}
        {/* 中央のメインエリア: ここに MuseumScreen のコンテンツを配置 */}
        {/* -------------------------------------------------------------------------- */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-200 overflow-y-auto relative">
          
          {/* MuseumScreen の Gallery View 部分を移植 */}
          <div className="w-full max-w-6xl flex-grow flex flex-col items-center justify-center"> {/* flex-grow で中央を広げる */}
            {/* Gallery Room Image */}
            <div className="relative bg-white rounded-lg shadow-2xs overflow-hidden w-full">
              {/* 中央の背景画像 */}
              <img 
                src={currentBackground} 
                alt="Museum Background" 
                className="w-full h-full object-contain absolute inset-0"
              />
              
              {/* Gallery Wall with Frames / MuseumPicture の部分 */}
              <div className="relative px-4 py-4 min-h-[400px] w-full">
                <MuseumPicture />
              </div>
            </div>

            {/* MuseumScreen の Bottom Controls 部分を移植 */}
            <div className="flex justify-center items-center gap-8 mt-4">
              <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
                {/* タイトル入力欄 */}
                <input
                  type="text"
                  className="w-80 text-gray-800 font-bold text-2xl bg-transparent outline-none text-center placeholder-neutral-300"
                  value={title}
                  placeholder='タイトル'
                  readOnly={!isEditing}
                  onChange={e => setTitle(e.target.value)}
                />
                {/* 編集/保存ボタン */}
                <button
                  className="ml-2 p-1 rounded font-bold text-gray-800"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <IconContext.Provider value={{ size: '1.5em' }}>
                    {isEditing ? (
                      <span role="img" aria-label="save"><MdOutlineCheck /></span>
                    ) : (
                      <span role="img" aria-label="edit"><MdOutlineEdit /></span>
                    )}
                  </IconContext.Provider>
                </button>
              </div>
            </div>
          </div>
          
          {/* 中央下部の 'タイトル' と '完了' ボタンを削除 (編集機能に置き換わったため) */}
        </div>

        {/* 右サイドバー: 美術品一覧 */}
        <RightSidebar artworks={dummyArtworks} />
      </main>
      
    </div>
  );
}