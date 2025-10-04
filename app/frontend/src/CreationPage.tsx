import React, { useState } from 'react';
// 画像をJavaScriptモジュールとしてインポートする
// 実際のファイルの場所に合わせて相対パスを修正してください。
// 例として、CreationPage.tsx と images フォルダが同じ階層にあると仮定します。
// あなたのパス構造に合わせて、 './assets/images/museum_background.jpg' のように調整してください。
import museumBackgroundUrl from './images/museum_background.jpg'; 
// ダミーの美術品画像も同様にインポートが必要ですが、ここでは省略します
// 例: import thumb1Url from './art/thumb1.jpg';


// ダミーデータと型定義 (変更なし)
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

// ダミーの美術品データ（右サイドバー用）
const dummyArtworks: Artwork[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  // 【修正点 2】ダミーの美術品URLはプレースホルダーURLに変更
  // 実際にはAPIから取得したURLか、インポートしたURLに置き換えてください
  url: `https://placehold.co/100x100/F0F0F0/000000?text=作品+${i+1}`, 
  name: `作品 ${i + 1}`,
}));

// ダミーの背景データ（左サイドバー用）
const dummyBackgrounds: Background[] = [
  // 【修正点 3】インポートしたURL変数を代入
  { id: 1, url: museumBackgroundUrl, name: '背景1' }, 
  { id: 2, url: museumBackgroundUrl, name: '背景2' }, 
];


//* 🖼️ 右側の美術品リストコンポーネント (省略)
const RightSidebar: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => (
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

//* 🖼️ 左側の背景リストコンポーネント (省略)
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
  // 【修正点 4】インポートしたURL変数をuseStateの初期値に設定
  const [currentBackground, setCurrentBackground] = useState<string>(museumBackgroundUrl);

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
        <LeftSidebar backgrounds={dummyBackgrounds} />

        {/* 中央のメインエリア (Flex Growで残りのスペースを全て占有) */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-200 overflow-y-auto relative">
          
          {/* 美術館の背景画像コンテナ */}
          <div className="relative w-full max-w-5xl aspect-video bg-white shadow-xl border border-gray-400">
            {/* 中央の背景画像 */}
            <img 
              src={currentBackground} 
              alt="Museum Background" 
              className="w-full h-full object-contain" // object-containで縦横比を維持し中央に表示
            />
            
            {/* HACK: 配置された美術品コンポーネントがこの上に重ねて表示される */}

            {/* 中央下部のタイトルと完了ボタン */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button className="px-6 py-2 bg-white border border-gray-500 rounded shadow hover:bg-gray-50 flex items-center">
                タイトル <span className="ml-2">📝</span>
              </button>
              <button className="px-6 py-2 bg-gray-300 border border-gray-500 rounded shadow hover:bg-gray-400">
                完了
              </button>
            </div>
          </div>
        </div>

        {/* 右サイドバー: 美術品一覧 */}
        <RightSidebar artworks={dummyArtworks} />
      </main>
      
    </div>
  );
}