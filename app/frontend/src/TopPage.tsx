import React from 'react';

// 【追加】window.location.href を使用する場合、ここに宣言
const handleNavigate = (path: string) => {
    window.location.href = path;
};

//* ドアが押された時の動作を定義する関数
//! 今回はアラート表示のみ、あとで部屋への移動に変更
const handleDoorClick = (doorName: string) => {
  alert(`${doorName}が押されました！`);
};

// ドアの情報を定義する型
// TODO: テーブルからの取得にはcolorは不要
interface Door {
  id: number;
  user_id: number; // Museumテーブルに合わせて追加
  name: string; // Museumテーブルのname
  color: string; // ドアの色
}
//* ドアの色作成する関数
const getRandomColor = (): string => {
  // 色相 (Hue): 0から360度まで完全にランダム
  const h = Math.floor(Math.random() * 360);
  
  // 彩度 (Saturation): 60%から80%の間でランダム (色が淡くなりすぎないように制御)
  const s = Math.floor(Math.random() * 20) + 60; 
  
  // 明度 (Lightness): 70の10前後の間でランダム (明るく柔らかい色に固定)
  const l = Math.floor(Math.random() * 20) + 75; 
  
  // HSL文字列を返す
  return `hsl(${h}, ${s}%, ${l}%)`;
};

// ドアのデータ配列 (user_idと美術館のnameを模した値を設定)
// HACK: 本来はサーバーから取得するが、今回は静的データで代用
const doorsData: Door[] = [
  { id: 1, user_id: 100, name: '自分の部屋', color: getRandomColor()},
  { id: 2, user_id: 201, name: '夕暮れの美術館', color: getRandomColor()},
  { id: 3, user_id: 202, name: '海の景色', color: getRandomColor()},
  { id: 4, user_id: 203, name: '未来派ギャラリー', color: getRandomColor()},
  { id: 5, user_id: 204, name: '光と影の部屋', color: getRandomColor()},
  { id: 6, user_id: 205, name: '深淵の青', color: getRandomColor()},
  { id: 7, user_id: 206, name: '黄金の肖像画', color: getRandomColor()},
  { id: 8, user_id: 207, name: '情熱のキャンバス', color: getRandomColor()},
  { id: 9, user_id: 208, name: '太陽のホール', color: getRandomColor()},
  { id: 10, user_id: 209, name: '静寂の展示室', color: getRandomColor()},
];

//*アプリケーションのトップページ（ドアの選択画面）コンポーネント
export default function TopPage() {
    // 新規作成ボタンが押された時の動作
    const handleNewCreationClick = () => {
        // '新規作成'用のCreationPageに遷移させるパスを設定
        handleNavigate('/create/new'); //HACK: 仮のパス
    };

    // 自分の部屋一覧ボタンが押された時の動作
    const handleMyRoomsClick = () => {
        // 自分の部屋一覧ページに遷移させるパスを設定
        handleNavigate('/show'); //HACK: 仮のパス
    };


  return (
    <div className="container text-center p-12">
        <div className="flex justify-between items-center mb-4 w-full" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
              onClick={handleMyRoomsClick}
              className="px-4 py-2 bg-blue-400 text-white font-semibold border rounded-md shadow-md hover:bg-blue-600 transition-colors text-sm"
          >自分の部屋一覧</button>

          <button 
              onClick={handleNewCreationClick}
              className="px-4 py-2 bg-blue-400 text-white font-semibold border rounded-md shadow-md hover:bg-blue-600 transition-colors text-sm"
          >新規作成</button>
        </div>
      <div className="grid grid-cols-5 grid-rows-2 gap-2.5 max-w-[800px] mx-auto my-10">
        {doorsData.map((door) => (
          <DoorComponent key={door.id} door={door} onClick={handleDoorClick} />
        ))}
      </div>
    </div>
  );
}

//?-------------------------------------------------------------
// ドアコンポーネントのProps型
interface DoorProps {
  door: Door;
  onClick: (doorName: string) => void;
}

// ドアコンポーネント（Tailwind CSS 版）
const DoorComponent: React.FC<DoorProps> = ({ door, onClick }) => {
  return (
    <div
      onClick={() => onClick(door.id)}
      className="relative w-full h-[250px] cursor-pointer select-none transition-transform duration-100 ease-in-out rounded-sm border-8 border-gray-800 shadow-md flex flex-col items-center justify-start overflow-hidden hover:scale-[1.03]"
      style={{ backgroundColor: door.color }}
    >
      {/* 内側の段差パネル（画像のような枠） */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-gray-800 shadow-inner"/>

      {/* ドアハンドル（丸い・右側） */}
      <div className="absolute right-[12px] top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 border border-gray-700 rounded-full"/>

      {/* ドア名ラベル */}
      <div className="absolute px-[6px] py-[3px] rounded max-w-[90%] text-ellipsis overflow-hidden whitespace-nowrap text-center bottom-[5px] left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px]">
        {door.name}
      </div>
    </div>
  );
};