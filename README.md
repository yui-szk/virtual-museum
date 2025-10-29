# virtual-museum

## フレームワーク等

```bash
app/
  frontend/  React 19 + TS + Vite (HMR)   
  backend/   Go 1.25.1 + chi (Air hot-reload)  
infra/  
  docker-compose, Makefile, .env.sample  
```
## Features

- Go API with chi, structured logs (slog), CORS with origins from env
- Endpoints: `GET /health`, `GET /api/v1/items`, `POST /api/v1/items`
- Frontend validates API responses with zod
- Hot reload: Vite HMR / Air for Go
- Lint/Format: golangci-lint, eslint + prettier; Tests: go test, vitest
 - Database: MySQL（docker-compose で起動、初回に自動テーブル作成）

## 立ち上げ方法


### 立ち上げまでのコード一式
```bash
# リポジトリーをクローン
git clone git@github.com:yut0takagi/giiku-camp-team16.git
# /infraに移動
cd infra

cp .env.sample .env

# docker のbuildとup(Docker Desktop等を立ち上げていることを確認の上実行)
docker compose up -d --build
```

### `docker compose up -d --build`でエラーが出る場合
```bash
# orphan や名前衝突が出る場合
docker compose down -v --remove-orphans
docker compose up -d --build
```

### 実行状況の確認
|  | ポート番号 | 確認 |
| ---- | ---- | ---- |
| フロントエンド | 5173 | `http://localhost:5173`にアクセス |
| バックエンド | 8080 | `curl http://localhost:8080/health`を実行 |
| ログ確認 | - | `docker compose logs -f` を実行|
| 停止と片付け | - | `docker compose down -v --remove-orphans` を実行|


> バックエンドは `.env` の DB 設定に基づき MySQL に接続します（デフォルト有効）。接続に失敗した場合はインメモリ実装にフォールバックします。

## ポート設定等
- Frontend: `FRONTEND_PORT`（デフォルト 5173）
- Backend: `BACKEND_PORT`（デフォルト 8080）
- CORS: `CORS_ALLOWED_ORIGINS`（例: `http://localhost:5173`）
- API ベース URL（フロント→バック）: `VITE_API_BASE_URL`（例: `http://localhost:8080`）


## Lint, Test関連
- HMR: フロントは Vite、バックエンドは Air が自動リビルド（`app/backend/.air.toml`）。
- Lint: `make -C infra lint`
- Test: `make -C infra test`
- Format: `make -C infra fmt`
- 依存整理（Go）: `make -C infra mod-tidy`（内部的に `docker compose exec app-backend sh -lc 'cd /app && go mod tidy'`）

## DB 関連
- `DB_ENABLED`（true/false）: DB 利用の有効/無効（デフォルト true）
- `DB_HOST`, `DB_PORT`: 例 `app-mysql:3306`
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_MIGRATE`: 起動時にテーブル自動作成（true 推奨）

MySQL コンテナの環境変数（`infra/.env`）:
- `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`

## GitHub Pagesへのデプロイ

このプロジェクトはGitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

- デプロイURL: `https://yui-szk.github.io/virtual-museum/`
- デプロイは `main` ブランチへのプッシュ時に自動実行されます
- 詳細は [docs/deployment.md](docs/deployment.md) を参照してください
