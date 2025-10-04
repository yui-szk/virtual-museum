# Backend API Documentation

## 概要

Go + chi を使用したClean Architecture構成のREST APIサーバーです。

## 🎉 動作確認済み

以下の5つのAPIエンドポイントが正常に動作することを確認済みです：

1. ✅ **公開ミュージアム取得** - `GET /api/v1/museums?excludeUserId=1&limit=10`
2. ✅ **ミュージアム詳細取得** - `GET /api/v1/museums/1`
3. ✅ **ミュージアムタイトル更新** - `PATCH /api/v1/museums/1/title`
4. ✅ **ミュージアム作成** - `POST /api/v1/museums`
5. ✅ **作品検索（MET API）** - `GET /api/v1/search/artworks?isHighlight=true&limit=5`

## アーキテクチャ

```
internal/
├── domain/          # エンティティとDTO
├── repository/      # データアクセス層
├── service/         # ビジネスロジック層
├── httpserver/      # HTTP層
│   ├── handlers/    # HTTPハンドラー
│   └── router.go    # ルーティング設定
├── config/          # 設定管理
└── logger/          # ログ設定
```

## API エンドポイント

### 1. ヘルスチェック

```bash
# サーバーの動作確認
curl http://localhost:8080/health
```

**レスポンス例:**
```json
{"status": "ok"}
```

### 2. ミュージアム管理API

#### 2.1 公開ミュージアム取得（指定ユーザー以外）

```bash
# 基本的な取得（ユーザーID=1以外の公開ミュージアムを10件取得）
curl "http://localhost:8080/api/v1/museums?excludeUserId=1&limit=10"

# 件数を指定（20件取得）
curl "http://localhost:8080/api/v1/museums?excludeUserId=1&limit=20"

# limitを省略した場合（デフォルト10件）
curl "http://localhost:8080/api/v1/museums?excludeUserId=1"
```

**レスポンス例:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "name": "Modern Art Collection",
    "description": "Contemporary artworks from around the world",
    "visibility": "public",
    "imageUrl": "/assets/modern-art.jpg",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### 2.2 ミュージアム詳細取得

```bash
# ID=1のミュージアム詳細を取得
curl http://localhost:8080/api/v1/museums/1

# ID=999（存在しない）の場合
curl http://localhost:8080/api/v1/museums/999
```

**成功レスポンス例:**
```json
{
  "id": 1,
  "userId": 2,
  "name": "Modern Art Collection",
  "description": "Contemporary artworks from around the world",
  "visibility": "public",
  "imageUrl": "/assets/modern-art.jpg",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**エラーレスポンス例:**
```json
{"error": "museum not found"}
```

#### 2.3 ミュージアムタイトル更新

```bash
# ID=1のミュージアムのタイトルを更新
curl -X PATCH http://localhost:8080/api/v1/museums/1/title \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Museum Title"}'

# 空のタイトルでエラーテスト
curl -X PATCH http://localhost:8080/api/v1/museums/1/title \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
```

**成功レスポンス例:**
```json
{"message": "title updated successfully"}
```

**エラーレスポンス例:**
```json
{"error": "title is required"}
```

#### 2.4 ミュージアム作成

```bash
# 新しいミュージアムを作成
curl -X POST http://localhost:8080/api/v1/museums \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "name": "My New Museum",
    "description": "A collection of my favorite artworks",
    "visibility": "public",
    "imageUrl": "/assets/my-museum.jpg"
  }'

# 必須フィールド不足でエラーテスト
curl -X POST http://localhost:8080/api/v1/museums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Museum without userId"
  }'
```

**成功レスポンス例:**
```json
{
  "id": 3,
  "userId": 2,
  "name": "My New Museum",
  "description": "A collection of my favorite artworks",
  "visibility": "public",
  "imageUrl": "/assets/my-museum.jpg",
  "createdAt": "2024-01-15T11:00:00Z"
}
```

### 3. 作品検索API（MET Museum API連携）

#### 3.1 作品検索

```bash
# 基本的な検索
curl "http://localhost:8080/api/v1/search/artworks?isHighlight=true&limit=5"

# 詳細な検索条件
curl "http://localhost:8080/api/v1/search/artworks?isHighlight=true&objectDate=1870&city=Paris&medium=Oil&limit=10"

# 年代のみで検索
curl "http://localhost:8080/api/v1/search/artworks?objectDate=1800"

# 都市のみで検索
curl "http://localhost:8080/api/v1/search/artworks?city=New%20York"

# 画材のみで検索
curl "http://localhost:8080/api/v1/search/artworks?medium=Watercolor"
```

**レスポンス例:**
```json
{
  "total": 1234,
  "objectIDs": [1, 45, 123, 456, 789]
}
```

### 4. MET Museum オブジェクト詳細取得

```bash
# MET Museum APIから特定のオブジェクト詳細を取得
curl http://localhost:8080/api/v1/met/objects/45734

# 存在しないIDでエラーテスト
curl http://localhost:8080/api/v1/met/objects/999999999
```

## エラーレスポンス

すべてのエラーは以下の形式で返されます：

```json
{"error": "エラーメッセージ"}
```

### HTTPステータスコード

- `200 OK`: 成功
- `201 Created`: 作成成功
- `400 Bad Request`: リクエストエラー（バリデーション失敗等）
- `404 Not Found`: リソースが見つからない
- `500 Internal Server Error`: サーバー内部エラー
- `502 Bad Gateway`: 外部API（MET Museum API）エラー

## 開発用コマンド

### サーバー起動（開発モード）

```bash
# Air を使用したホットリロード
cd app/backend
air

# 通常起動
go run cmd/server/main.go
```

### テスト実行

```bash
# 全テスト実行
go test ./...

# カバレッジ付きテスト
go test -cover ./...

# 特定パッケージのテスト
go test ./internal/service/...
```

### リント・フォーマット

```bash
# リント実行
golangci-lint run

# フォーマット
go fmt ./...
goimports -w .
```

## データベース

### テーブル構造

```sql
-- museums テーブル
CREATE TABLE museums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    visibility ENUM('public', 'private') DEFAULT 'public',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### サンプルデータ挿入

```sql
INSERT INTO museums (user_id, name, description, visibility, image_url) VALUES
(1, 'Classical Art Museum', 'A collection of classical European paintings', 'public', '/assets/classical.jpg'),
(2, 'Modern Art Gallery', 'Contemporary and modern artworks', 'public', '/assets/modern.jpg'),
(3, 'Private Collection', 'My personal art collection', 'private', '/assets/private.jpg');
```

## 環境変数

```bash
# サーバー設定
BACKEND_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:5173

# データベース設定
DB_ENABLED=true
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=museum_db
DB_MIGRATE=true
```

## トラブルシューティング

### よくある問題

1. **データベース接続エラー**
   ```bash
   # MySQLコンテナが起動しているか確認
   docker compose ps
   
   # ログを確認
   docker compose logs app-mysql
   ```

2. **CORS エラー**
   ```bash
   # .envファイルのCORS設定を確認
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

3. **MET API エラー**
   ```bash
   # インターネット接続を確認
   curl https://collectionapi.metmuseum.org/public/collection/v1/search?q=*
   ```

### ログレベル設定

```bash
# デバッグログを有効にする
export LOG_LEVEL=debug
go run cmd/server/main.go
```