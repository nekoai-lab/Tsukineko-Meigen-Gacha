# Vercel Deployment Guide (月ねこ名言帖)

このアプリケーションを Vercel にデプロイ（公開）するための手順です。

## 1. Vercel プロジェクトの作成

1.  **[Vercel Dashboard](https://vercel.com/dashboard)** にアクセスします。
2.  **"Add New..."** ボタンをクリックし、**"Project"** を選択します。
3.  **"Import Git Repository"** 画面で、先ほどアップロードした Github リポジトリ (`nekoai-lab/Tsukineko-Meigen-Gacha`) を探して **"Import"** をクリックします。

## 2. 環境変数の設定 (重要！)

**ここが一番重要です。** AIを動かすための「鍵」をVercelに教えてあげる必要があります。

"Configure Project" 画面の **"Environment Variables"** セクションを展開し、以下の値を入力してください。

| Key (名前) | Value (値) |
| :--- | :--- |
| `GEMINI_API_KEY` | (あなたの Google Gemini API Key) |
| `RAKUTEN_APPLICATION_ID` | (もし使用等の場合は設定。今回は未使用でもOKならば省略可) |

※ Rakuten APIを使用しない場合、コード内でエラーハンドリングされているので設定しなくてもアプリ自体は動きますが、念のため設定しておくと安心です。

## 3. デプロイの実行

1.  環境変数を入力したら、**"Deploy"** ボタンをクリックします。
2.  ビルドが始まります（約1〜2分かかります）。
3.  画面に紙吹雪が舞ったらデプロイ完了です！
4.  表示されたURLをクリックすると、世界中からあなたのアプリにアクセスできるようになります。

---

### トラブルシューティング

*   **Q. 「Server Configuration Error」が出る**
    *   A. 環境変数 `GEMINI_API_KEY` が正しく設定されていない可能性があります。Vercelの管理画面（Settings > Environment Variables）で再度確認してください。
*   **Q. デザインが崩れている**
    *   A. ブラウザのキャッシュをクリアしてみてください。それでも直らない場合は、Githubの最新コードが正しく反映されているか確認してください。
