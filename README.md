# 技育camp Hackathon

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

## 立ち上げ方法

1) `cd infra`
2) `cp .env.sample .env`
3) `docker compose up -d --build`
   - orphan や名前衝突が出る場合: `docker compose down -v --remove-orphans` 後に再実行
4) 初回のみ（必要に応じて）Go 依存解決: `docker compose exec app-backend sh -lc 'cd /app && go mod tidy'`（または `make mod-tidy`）
5) フロントエンド: http://localhost:5173
6) ヘルスチェック: `curl http://localhost:8080/health`
7) ログ確認: `docker compose logs -f`
8) 停止と片付け: `docker compose down -v --remove-orphans`

## Lint, Test関連
- HMR: フロントは Vite、バックエンドは Air が自動リビルド（`app/backend/.air.toml`）。
- Lint: `make -C infra lint`
- Test: `make -C infra test`
- Format: `make -C infra fmt`
- 依存整理（Go）: `make -C infra mod-tidy`（内部的に `docker compose exec app-backend sh -lc 'cd /app && go mod tidy'`）

## ポート設定等
- Frontend: `FRONTEND_PORT`（デフォルト 5173）
- Backend: `BACKEND_PORT`（デフォルト 8080）
- CORS: `CORS_ALLOWED_ORIGINS`（例: `http://localhost:5173`）
- API ベース URL（フロント→バック）: `VITE_API_BASE_URL`（例: `http://localhost:8080`）
