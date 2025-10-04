import React, { useState } from 'react';
// アイコンとコンテキストをインポート
import { IconContext } from 'react-icons'
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";

// 画像をJavaScriptモジュールとしてインポートする
//! 本当は背景画像のURLを取得する必要あり 
import museumRoom from "../assets/museum-sample.jpg";

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


//! 右側の美術品リストコンポーネント (パディング p-1 に縮小済み)
const RightSidebar: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => (
  <div className="w-64 flex-shrink-0 bg-gray-100 border-l border-gray-300 overflow-y-auto p-1">
    <h3 className="text-sm font-semibold mb-1 text-gray-700">美術品一覧</h3>
    <div className="grid grid-cols-2 gap-1">
      {artworks.map((art) => (
        <div
          key={art.id}
          className="aspect-square bg-white border border-gray-400 cursor-grab rounded-sm overflow-hidden shadow-sm flex items-center justify-center text-xs"
        >
          {/* ダミーデータなので、画像ではなくIDを表示 */}
          ?? {art.id}
        </div>
      ))}
    </div>
  </div>
);

//* 左側の背景リストコンポーネント
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">

      {/* 画面タイトル */}
      <header className="flex-shrink-0 p-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">新規作成</h1>
      </header>

      {/* メインレイアウト: 左サイドバー + 中央 + 右サイドバー */}
      <main className="flex flex-1 overflow-hidden">

      {/* 左サイドバー: 背景画像一覧 */}
      {/* 選択したら真ん中の画像に反映 */}
      <LeftSidebar
        backgrounds={dummyBackgrounds}
        onBackgroundSelect={handleBackgroundChange}
      />
        {/* 中央の絵を配置する */}
        <div className="flex-1 flex flex-col items-center p-3 relative overflow-y-auto bg-gray-200">

          {/* Gallery View - 画像コンテナ */}
            <div className="relative w-full overflow-hidden flex justify-center items-center aspect-video">

              {/* 中央の背景画像 */}
              <img
                src={currentBackground}
                alt="Museum Background"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Bottom Controls - タイトル入力欄、「戻る」「完了」ボタンを配置 */}
            <div className="flex justify-between items-end w-full max-w-xl mt-4 mb-4">
              
              {/* 1. 左下に「戻る」ボタンを配置 */}
              <button 
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-300 rounded-md hover:bg-gray-400 transition shadow"
                // onClick={handleBack} //!戻る処理の記述
              >
                戻る
              </button>

              {/* 2. 中央にタイトル入力欄を配置 */}
              <div className="p-2 bg-white rounded-md shadow flex items-center gap-2">
                <input
                  type="text"
                  className="w-60 text-gray-800 font-medium text-lg bg-transparent outline-none text-center placeholder-gray-400"
                  value={title}
                  placeholder='タイトル'
                  readOnly={!isEditing}
                  onChange={e => setTitle(e.target.value)}
                />
                {/* 編集/保存ボタン */}
                <button
                  className="p-1 rounded font-bold text-gray-800"
                  onClick={() => setIsEditing(!isEditing)} //! 編集
                >
                  <IconContext.Provider value={{ size: '1.5em' }}>
                    {isEditing ? (
                      <MdOutlineCheck />
                    ) : (
                      <MdOutlineEdit />
                    )}
                  </IconContext.Provider>
                </button>
              </div>

              {/* 3. 右下に「完了」ボタンを配置 */}
              <button 
                className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition shadow"
                // onClick={handleComplete} 完了処理を実装する場合はここに
              >
                完了
              </button>
          </div>
        </div>

        {/* 右サイドバー: 美術品一覧 */}
        <RightSidebar artworks={dummyArtworks} />
      </main>

    </div>
  );
}
