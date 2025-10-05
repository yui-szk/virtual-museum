# Frontend API Library

## 概要

このディレクトリには、バックエンドAPIとの通信を行うための関数が含まれています。

## ファイル構成

- `api.ts` - API関数とスキーマ定義
- `types.ts` - 型定義

## API関数一覧

### ミュージアム管理API
- `fetchPublicMuseums(excludeUserId, limit)` - 公開ミュージアム取得
- `fetchMuseumById(id)` - ミュージアム詳細取得
- `createMuseum(museum)` - ミュージアム作成
- `updateMuseumTitle(id, title)` - ミュージアムタイトル更新

### 作品検索API
- `searchArtworks(params)` - 作品検索（MET Museum API連携）
- `fetchMetObject(objectId)` - MET Museum オブジェクト詳細取得

### その他
- `healthCheck()` - ヘルスチェック
- `fetchItems()` - アイテム取得（既存）
- `postItem(body)` - アイテム作成（既存）

## デバッグ機能

すべてのAPI関数には詳細なデバッグログが組み込まれています。

### デバッグログの確認方法

1. **ブラウザの開発者ツールを開く**
   - Chrome/Edge: `F12` または `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Firefox: `F12` または `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

2. **Consoleタブを選択**

3. **API関数を呼び出す**
   ```typescript
   import { fetchPublicMuseums, healthCheck } from './lib/api'
   
   // 例: ヘルスチェック
   healthCheck()
   
   // 例: 公開ミュージアム取得
   fetchPublicMuseums(1, 10)
   ```

### ログの種類と意味

| アイコン | 意味 | 説明 |
|---------|------|------|
| 🔍 | Request | リクエスト開始（URL、パラメータ、ボディ） |
| 📡 | Response | レスポンス受信（ステータス、成功/失敗） |
| 📦 | Data | レスポンスデータの内容 |
| ✅ | Success | 成功時の要約情報 |
| ❌ | Error | エラー時の詳細情報 |

### ログ例

```
🔍 [API] fetchPublicMuseums - Request: {url: "http://localhost:8080/api/v1/museums?excludeUserId=1&limit=10", excludeUserId: 1, limit: 10}
📡 [API] fetchPublicMuseums - Response: {status: 200, ok: true}
📦 [API] fetchPublicMuseums - Data: [{id: 1, userId: 2, name: "Modern Art Collection", ...}]
✅ [API] fetchPublicMuseums - Success: 3 museums
```

## 使用例

### 1. ヘルスチェック

```typescript
import { healthCheck } from './lib/api'

try {
  const result = await healthCheck()
  console.log('Server status:', result.status)
} catch (error) {
  console.error('Health check failed:', error)
}
```

### 2. 公開ミュージアム取得

```typescript
import { fetchPublicMuseums } from './lib/api'

try {
  const museums = await fetchPublicMuseums(1, 10) // ユーザーID=1以外の10件
  console.log('Museums:', museums)
} catch (error) {
  console.error('Failed to fetch museums:', error)
}
```

### 3. ミュージアム作成

```typescript
import { createMuseum } from './lib/api'

try {
  const newMuseum = await createMuseum({
    userId: 2,
    name: "My Art Collection",
    description: "Personal collection of favorite artworks",
    visibility: "public",
    imageUrl: "/assets/my-collection.jpg"
  })
  console.log('Created museum:', newMuseum)
} catch (error) {
  console.error('Failed to create museum:', error)
}
```

### 4. 作品検索

```typescript
import { searchArtworks, fetchMetObject } from './lib/api'

try {
  // ハイライト作品を5件検索
  const searchResult = await searchArtworks({
    isHighlight: true,
    limit: 5
  })
  
  console.log(`Found ${searchResult.total} artworks`)
  
  // 最初の作品の詳細を取得
  if (searchResult.objectIDs.length > 0) {
    const artwork = await fetchMetObject(searchResult.objectIDs[0])
    console.log('First artwork:', artwork.title)
  }
} catch (error) {
  console.error('Search failed:', error)
}
```

## トラブルシューティング

### よくある問題

1. **CORS エラー**
   ```
   Access to fetch at 'http://localhost:8080/api/v1/museums' from origin 'http://localhost:5173' has been blocked by CORS policy
   ```
   **解決方法**: バックエンドのCORS設定を確認してください。

2. **API Base URL未設定**
   ```
   VITE_API_BASE_URL is not set; API calls will likely fail
   ```
   **解決方法**: `.env`ファイルに`VITE_API_BASE_URL=http://localhost:8080`を追加してください。

3. **ネットワークエラー**
   ```
   Failed to fetch
   ```
   **解決方法**: バックエンドサーバーが起動しているか確認してください。

### デバッグのコツ

1. **ネットワークタブも確認**
   - 開発者ツールのNetworkタブでHTTPリクエスト/レスポンスの詳細を確認

2. **エラーレスポンスの確認**
   - 4xx/5xxエラーの場合、レスポンスボディにエラー詳細が含まれています

3. **型検証エラー**
   - Zodスキーマ検証エラーが発生した場合、APIレスポンス形式が期待と異なる可能性があります

## 環境設定

### 必要な環境変数

```bash
# .env ファイル
VITE_API_BASE_URL=http://localhost:8080
```

### 開発サーバー起動

```bash
# フロントエンド
cd app/frontend
npm run dev

# バックエンド（別ターミナル）
cd app/backend
air
```

## 型安全性

すべてのAPI関数はZodスキーマを使用して型検証を行います：

- リクエスト/レスポンスの型安全性
- 実行時の型検証
- TypeScriptの型推論サポート

## パフォーマンス

- すべてのAPI関数は`async/await`を使用
- エラーハンドリングは統一された形式
- レスポンスデータの型検証により、予期しないデータ形式を早期発見