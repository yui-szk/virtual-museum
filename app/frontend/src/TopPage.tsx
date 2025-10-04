import React from 'react';

// ドアが押された時の動作を定義する関数
const handleDoorClick = (doorName: string) => {
  alert(`${doorName}が押されました！`);
};

// ランダムな16進数の色コードを生成するヘルパー関数
const getRandomColor = () => {
  // 明るすぎず、暗すぎない色を生成するため、000000からFFFFFFまでをランダムに選ぶ
  // 今回は、画像の雰囲気に合わせて特定のパレットを使うため、この関数は使用せず、既存の色を使うか、
  // 後述のようにドアのnameを表示するために、ドアのデータを変更します。
  // 画像通りの色を再現するため、この関数は使いません。
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

// ドアの情報を定義する型
interface Door {
  id: number;
  user_id: number; // Museumテーブルに合わせて追加
  name: string; // Museumテーブルのname
  color: string; // ドアの色
  isMine: boolean;
}

// ドアのデータ配列 (user_idと美術館のnameを模した値を設定)
const doorsData: Door[] = [
  // 自分の部屋
  { id: 1, user_id: 100, name: '自分の部屋', color: '#ffc107', isMine: true }, // 黄色
  // 他の人の部屋 (美術館の名前を設定)
  { id: 2, user_id: 201, name: '夕暮れの美術館', color: '#f5f5dc', isMine: false }, // 薄いベージュ
  { id: 3, user_id: 202, name: '海の景色', color: '#4682b4', isMine: false }, // 青
  { id: 4, user_id: 203, name: '未来派ギャラリー', color: '#4682b4', isMine: false }, // 青
  { id: 5, user_id: 204, name: '光と影の部屋', color: '#ffc107', isMine: false }, // 黄色
  
  { id: 6, user_id: 205, name: '深淵の青', color: '#4682b4', isMine: false }, // 青
  { id: 7, user_id: 206, name: '黄金の肖像画', color: '#ffc107', isMine: false }, // 黄色
  { id: 8, user_id: 207, name: '情熱のキャンバス', color: '#dc3545', isMine: false }, // 赤
  { id: 9, user_id: 208, name: '太陽のホール', color: '#ffc107', isMine: false }, // 黄色
  { id: 10, user_id: 209, name: '静寂の展示室', color: '#4682b4', isMine: false }, // 青
];

/**
 * アプリケーションのトップページ（ドアの選択画面）コンポーネント。
 */
export default function TopPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>トップページ_美術館への移動</h1>
      
      <div 
        style={{
          display: 'grid',
          // 2行5列のグリッドレイアウトでドアを配置
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '10px',
          maxWidth: '800px', // ドアを並べるエリアの最大幅を設定
          margin: '40px auto', // 中央寄せ
        }}
      >
        {doorsData.map((door) => (
          <DoorComponent key={door.id} door={door} onClick={handleDoorClick} />
        ))}
      </div>
    </div>
  );
}


// ドアコンポーネントのProps型
interface DoorProps {
  door: Door;
  onClick: (doorName: string) => void;
}

/**
 * 個々のドアを表すコンポーネント。（最初の画像デザインに戻す）
 */
const DoorComponent: React.FC<DoorProps> = ({ door, onClick }) => {
  return (
    <div
      onClick={() => onClick(door.name)}
      style={{
        // ドア本体のスタイル
        backgroundColor: door.color,
        height: '180px', 
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.1s ease-in-out',
        userSelect: 'none',
        
        // 最初の画像の雰囲気を再現
        border: '1px solid #ccc', // 細い枠線
        borderRadius: '3px',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)', // 控えめなシャドウ
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
      }}
    >
      {/* ドアハンドル（丸みを帯びた形状に戻す） */}
      <div style={{
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '8px', // 幅を細く
        height: '25px', // 高さを短く
        backgroundColor: '#ccc',
        borderRadius: '3px',
        border: '1px solid #777',
      }} />

      {/* ドア名を表示 (自分の部屋かどうかにかかわらず、nameを表示) */}
      <div style={{ 
        position: 'absolute',
        top: door.isMine ? '5px' : 'auto', // 自分の部屋は上部
        bottom: door.isMine ? 'auto' : '5px', // 他の部屋は下部
        left: door.isMine ? '5px' : '50%', // 自分の部屋は左寄せ
        transform: door.isMine ? 'none' : 'translateX(-50%)', // 他の部屋は中央揃え
        
        backgroundColor: door.isMine ? '#f7f7f7' : 'rgba(0, 0, 0, 0.6)', // 自分の部屋は明るい、他は暗い背景
        color: door.isMine ? '#333' : 'white', // 自分の部屋は濃い、他は白い文字
        padding: '3px 6px',
        borderRadius: '3px',
        fontSize: door.isMine ? '14px' : '10px',
        fontWeight: door.isMine ? 'bold' : 'normal',
        textAlign: 'center',
        maxWidth: '90%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}>
        {door.name}
      </div>

    </div>
  );
};