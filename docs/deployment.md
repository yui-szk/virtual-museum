# GitHub Pagesへのデプロイ

このプロジェクトは、GitHub Actionsを使用してGitHub Pagesに自動的にデプロイされます。

## 設定方法

### 1. GitHub Pagesの有効化

リポジトリの設定でGitHub Pagesを有効にする必要があります：

1. GitHubリポジトリページで `Settings` タブをクリック
2. 左サイドバーの `Pages` をクリック
3. **Source** セクションで `GitHub Actions` を選択

### 2. デプロイの実行

デプロイは以下のタイミングで自動的に実行されます：

- `main` ブランチにプッシュしたとき
- 手動で実行したいときは、`Actions` タブから `Deploy to GitHub Pages` ワークフローを選択し、`Run workflow` をクリック

### 3. デプロイされたサイトの確認

デプロイが完了すると、以下のURLでサイトにアクセスできます：

```
https://yui-szk.github.io/virtual-museum/
```

## ワークフローの詳細

`.github/workflows/deploy.yml` がデプロイワークフローを定義しています。

### ビルドプロセス

1. Node.js 20をセットアップ
2. 依存関係をインストール (`npm ci`)
3. フロントエンドをビルド (`npm run build`)
4. ビルド成果物（`app/frontend/dist`）をアップロード

### デプロイプロセス

1. アップロードされたアーティファクトをGitHub Pagesにデプロイ

## ローカルでの検証

本番環境と同じ設定でビルドする場合：

```bash
cd app/frontend
NODE_ENV=production npm run build
```

ビルド成果物は `app/frontend/dist` に生成されます。

## 技術詳細

- **Vite設定**: `vite.config.ts` で本番環境のベースパスを `/virtual-museum/` に設定
- **環境変数**: `NODE_ENV=production` で本番ビルドを実行
- **権限**: ワークフローには `pages: write` と `id-token: write` 権限が必要
