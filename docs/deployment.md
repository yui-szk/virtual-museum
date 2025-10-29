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

## デプロイ状態の確認方法

### 方法1: GitHub Actionsの実行状態を確認

1. GitHubリポジトリページで `Actions` タブをクリック
2. 左サイドバーから `Deploy to GitHub Pages` ワークフローを選択
3. ワークフロー実行の一覧が表示されます
   - ✅ 緑色のチェックマーク: デプロイ成功
   - ❌ 赤色のバツマーク: デプロイ失敗
   - 🟡 黄色の点: 実行中
4. 実行結果をクリックすると、詳細なログを確認できます
   - `build` ジョブ: ビルドプロセスの実行状況
   - `deploy` ジョブ: GitHub Pagesへのデプロイ状況

### 方法2: GitHub Pagesの設定画面で確認

1. GitHubリポジトリページで `Settings` タブをクリック
2. 左サイドバーの `Pages` をクリック
3. ページ上部に以下のような情報が表示されます：
   - **Your site is live at** `https://yui-szk.github.io/virtual-museum/` : デプロイ成功
   - 最後のデプロイ日時とコミットハッシュも表示されます
4. **Visit site** ボタンをクリックすると、デプロイされたサイトにアクセスできます

### 方法3: 実際にサイトにアクセスして確認

1. ブラウザで https://yui-szk.github.io/virtual-museum/ にアクセス
2. サイトが正常に表示されることを確認
3. ブラウザの開発者ツール（F12）でコンソールエラーがないか確認

### トラブルシューティング

#### デプロイが失敗する場合

1. `Actions` タブでエラーログを確認
2. よくある原因：
   - ビルドエラー: `build` ジョブのログを確認
   - 権限エラー: `Settings` → `Pages` で Source が `GitHub Actions` になっているか確認
   - 依存関係のエラー: `package-lock.json` が最新かどうか確認

#### サイトが表示されない場合

1. GitHub Pagesの設定が有効になっているか確認（`Settings` → `Pages`）
2. デプロイが完了しているか確認（緑色のチェックマークがあるか）
3. ブラウザのキャッシュをクリアして再度アクセス
4. URLが正しいか確認（`https://yui-szk.github.io/virtual-museum/`）

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
