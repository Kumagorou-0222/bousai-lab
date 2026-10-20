# Threads・Instagram承認済み投稿の接続準備

この変更はレビュー用です。`data/meta-approved-posts.json` は空、`META_DRY_RUN` は既定で有効、全体と媒体別の投稿フラグは既定で無効です。認証情報の発行・保存、実APIへの書き込み、実投稿は行っていません。Facebook投稿と既存X workflowには接続しません。

## 実行と承認

`.github/workflows/meta-auto-post.yml` は毎日20:15 JSTに起動し、mainにある承認台帳だけを読みます。手動起動もmainのみです。台帳の各項目は媒体、当日のJST日付、記事slug、campaign、本文、Instagramの公開画像URL、承認時刻、当日22:00 JSTまでの期限、内容のSHA-256、`approved: true` を持ちます。本文・URL・期限を変更するとハッシュが一致せず停止します。台帳を更新するPRで画像と本文を人が確認する運用が必要です。現在の台帳は空なので、フラグが変わっても送信対象はありません。期限切れや翌日持越しは選びません。

投稿時は `SOCIAL_PUBLISH_ENABLED=true`、`META_DRY_RUN=false` と、対象媒体の `THREADS_PUBLISH_ENABLED=true` または `INSTAGRAM_PUBLISH_ENABLED=true` がすべて必要です。アダプターも同じ条件を再確認します。専用 `social-ledger` ブランチへの予約を送信前に作り、媒体・記事・campaign別に二重送信を止めます。コンテナIDを保存し、公開結果が不明なら自動再送しません。Xの投稿台帳とworkflowは独立しており、XとMeta間で同じ記事を投稿すること自体は抑止しません。各媒体での再送を止めます。

有効化後の各送信でも、予約と書き込みAPIより前に対象媒体の `/me` をGETし、トークンのアカウントIDとVariableのIDが一致することを確認します。不一致や読み取り失敗なら送信しません。

## 最小権限と保存先

| 媒体 | OAuth方式と最小権限 | GitHub Actions Secret | GitHub Actions Variable |
| --- | --- | --- | --- |
| Threads | Threads API、`threads_basic` と `threads_content_publish` | `THREADS_ACCESS_TOKEN` | `THREADS_ACCOUNT_ID`、`THREADS_TOKEN_EXPIRES_AT`、`THREADS_PUBLISH_ENABLED` |
| Instagram | Instagram Login、`instagram_business_basic` と `instagram_business_content_publish` | `INSTAGRAM_ACCESS_TOKEN` | `INSTAGRAM_ACCOUNT_ID`、`INSTAGRAM_TOKEN_EXPIRES_AT`、`INSTAGRAM_PUBLISH_ENABLED`、`META_GRAPH_VERSION` |

共通Variableは `META_DRY_RUN`、`SOCIAL_PUBLISH_ENABLED`、`SOCIAL_LEDGER_BRANCH=social-ledger` です。workflow内の投稿台帳用 `SOCIAL_LEDGER_GITHUB_TOKEN` には、その実行の組み込み `GITHUB_TOKEN` を渡します。workflow権限は対象リポジトリの `contents: write` で、追加のGitHub PATは必要ありません。専用台帳ブランチはまだ作りません。現行VercelのIgnored Build StepはAutomaticなので、台帳ブランチを動かす前に不要なVercelプレビューを防ぐ設定を別途検討します。

認証先だけの確認は、OAuthと保存が別途認められた後に `META_CONNECTION_CHECK_ENABLED=true` を一時的に指定し、`node --experimental-strip-types scripts/checkMetaConnection.ts threads` または `instagram` を実行します。これは各媒体の `/me` をGETし、返ったIDと設定IDを照合するだけです。投稿フラグと台帳は使いません。トークン値を表示しません。

## 期限と更新

[Threadsの長期トークン](https://developers.facebook.com/documentation/threads/get-started/long-lived-tokens)と[Instagram Loginの長期トークン](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/business-login)は通常60日で、24時間以上経過し失効前なら更新できます。コードは期限変数が欠落・不正、または期限まで7日以内なら投稿を停止します。自動更新は未実装です。運用担当が期限前に公式手順で更新し、GitHub SecretのトークンとVariableの期限を一組で置き換え、GET照合してから投稿を有効にします。失効や権限変更時は再認証が必要です。

Meta APIとGitHub台帳の各通信は10秒で打ち切り、結果が不明な場合は自動再送しません。本番送信前には、全体実行時間、画像公開URLの要件、専用台帳ブランチ、Instagramのユースケース・権限、各媒体のOAuth結果を別途確認します。X投稿とFacebook投稿は変更しません。
