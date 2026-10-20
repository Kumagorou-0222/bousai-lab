# 投稿履歴更新時のビルド節約

`scripts/ignore-history-only-build.mjs` は、前回成功デプロイから今回のコミットまでの差分が `data/x-post-history.json` だけなら終了コード0を返します。差分やGit履歴を確認できない場合は終了コード1を返し、通常のビルドへ進みます。

`vercel.json` に `ignoreCommand` は設定しません。これを設定すると、Vercel管理画面の既存 Ignored Build Step を上書きするためです。現行の管理画面のコマンドを読み取り、既存の省略条件を保ったうえでこのスクリプトを追加する方法を確認するまで、投稿履歴更新時のビルド省略は有効化しません。新しいコマンドを登録する前に、main の記事変更でビルドが実行され、履歴だけの更新で省略されることをプレビューまたは管理画面のログで確認してください。

Threads投稿案ページはリクエスト時に公開mainのX投稿履歴を読みます。取得に失敗した場合は警告を表示し、古い履歴を最新として表示しません。Threadsへの自動投稿は行いません。

ローカル検証: `node --experimental-strip-types --test scripts/ignore-history-only-build.test.mjs lib/threadsHistory.test.mjs`、`npm run build`。
