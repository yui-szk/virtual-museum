---
name: verify
description: virtual-museum のフロントエンド変更を実ブラウザで検証する手順（起動・駆動・撮影のレシピ）
---

# virtual-museum 検証レシピ

## 起動

```bash
cd infra && docker compose up -d   # frontend :5173 / backend :8081(マシンにより :8080) / app-db
curl http://localhost:8081/health  # {"status":"ok"}
```

- `infra/.env` は untracked。ポートは `BACKEND_PORT` を参照（8080 が他プロジェクトと衝突するマシンでは 8081 + `docker-compose.override.yml` 運用）
- ビルド/テストはホストに node_modules が無いのでコンテナ内で:
  `docker compose exec app-frontend npm run build` / `docker compose exec -T app-frontend npx vitest run`
- `npm run test` は watch モードで返ってこない。必ず `vitest run` を使う
- `npm run lint` は既存の設定問題（`plugin:react-refresh/recommended` 非互換）で壊れている（2026-07 時点）

## ブラウザ駆動（GUI surface）

Playwright のブラウザはダウンロードせず、`playwright-core` + インストール済み Google Chrome を使う:

```js
import { chromium } from 'playwright-core'
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
```

`playwright-core` はスクラッチパッドに `npm i playwright-core` で入れる（リポジトリには入れない）。

## テストデータ

DB 初期状態は museums が 0 件でトップページは空状態になる。ドア表示を検証するには:

1. users に FK 用の行が必要:
   `docker exec infra-app-db-1 psql -U appuser -d appdb -c "INSERT INTO users (name,email,pass_hash) VALUES ('dev','dev@example.com','x')"`
2. `POST /api/v1/museums` に `{"userId":<users.id>,"name":"...","description":"...","visibility":"public","imageUrl":""}`

## 駆動する価値のあるフロー

- トップ `/`: ドアグリッド表示、ドア hover（rotateY が computed style に出る）、ドアクリック→ `/museum/:id` に SPA 遷移（`window.__marker` がリロードで消えないことで確認）
- 状態分岐: `page.route('**/api/v1/museums*', ...)` で遅延（スケルトン）・`[]`（空状態）・abort（エラー+再試行）を再現できる
- 他ページ非破壊: `/show` `/create` は明色テーマのまま

## ハマりどころ

- `GET /api/v1/museums` は ORDER BY なしで順序が非決定的。表示順を前提にした assert は落ちる
- `excludeUserId` は 1 以上の整数のみ有効（0 は 400）
