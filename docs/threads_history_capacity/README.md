# 投稿履歴更新時のビルド節約

`scripts/ignore-history-only-build.mjs` は、前回成功デプロイから今回のコミットまでの差分が `data/x-post-history.json` だけなら終了コード0を返します。差分やGit履歴を確認できない場合は終了コード1を返し、通常のビルドへ進みます。

`vercel.json` に `ignoreCommand` は設定しません。これを設定すると、Vercel管理画面の Ignored Build Step を上書きするためです。2026年10月21日に管理画面の現行値が `Automatic` と確認されました。この設定では各コミットをビルドするため、投稿履歴更新時のビルド省略はまだ有効ではありません。

次の段階は、レビュー後に管理画面の Ignored Build Step を「Run my Node script」に変更し、`scripts/ignore-history-only-build.mjs` を指定する案です。これは本番デプロイ動作が継続的に変わる操作なので、設定変更前に対象と影響を改めて確認します。適用後は、main の記事変更でビルドが実行され、履歴だけの更新で省略されることをデプロイログで確かめます。Vercel環境に比較元のGitコミットがない場合、スクリプトは安全側で通常ビルドへ進みます。その場合は効率化が効いていないと判断し、ログから原因を確認します。

Threads投稿案ページはリクエスト時に公開mainのX投稿履歴を読みます。取得に失敗した場合は警告を表示し、古い履歴を最新として表示しません。Threadsへの自動投稿は行いません。

ローカル検証: `node --experimental-strip-types --test scripts/ignore-history-only-build.test.mjs lib/threadsHistory.test.mjs`、`npm run build`。
