// src/vite-env.d.ts または src/types.d.ts

// 既存のViteクライアントの参照（あれば残す）
/// <reference types="vite/client" />

// 【追加】画像ファイル、SVG、その他アセットをモジュールとして定義
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

// 【重要】JPEGファイルをインポートした際にstring (URL) を返すように定義
declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}