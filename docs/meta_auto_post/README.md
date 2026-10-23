# Threads・Instagram承認済み投稿の接続準備

この変更はレビュー用です。`data/meta-approved-posts.json` は空、`META_DRY_RUN` は既定で有効、全体と媒体別の投稿フラグは既定で無効です。認証情報の発行・保存、実APIへの書き込み、実投稿は行っていません。Facebook投稿と既存X workflowには接続しません。

## 実行と承認

workflowは手動起動のみで、mainの空の承認台帳（version 2）を読みます。定期起動は接続と広告ラベルを検証するまで設定しません。台帳には媒体、当日のJST日付、記事slug、campaign、本文、対象アカウントID、非商業教育／商業の分類、レビュー担当と日時、承認日時、当日22:00 JSTまでの期限、内容のSHA-256、`approved: true` を記録します。画像を使うときは公開JPEG URLと画像SHA-256も含めます。本文・画像・分類・対象アカウント・期限を変更するとハッシュが一致せず停止します。18:00以上22:00未満の当日分だけ選び、期限切れや翌日への持越しは行いません。

投稿時は `SOCIAL_PUBLISH_ENABLED=true`、`META_DRY_RUN=false` と、対象媒体の `THREADS_PUBLISH_ENABLED=true` または `INSTAGRAM_PUBLISH_ENABLED=true` がすべて必要です。アダプターも同じ条件を再確認します。商業分類または本文に外部URLを含む投稿は、広告ラベルのAPI対応が確認できるまで拒否します。サイト記事への誘導でも商業性が消えるとは扱いません。公開JPEGの実体、Content-Type、ハッシュ、デコード、寸法、縦横比を送信前に検証します。Instagramは幅320〜1440px・縦横比4:5〜1.91:1、Threadsは幅320px以上・縦横比10:1以内、双方8MB以下とします。これはローカルの事前検査であり、Meta側での実画像受理は別途確認が必要です。専用 `social-ledger` ブランチへの予約を送信前に作り、媒体・アカウント・JST日付ごとに二重送信を止めます。コンテナIDを保存し、公開結果が不明なら自動再送しません。Xの投稿台帳とworkflowは独立しています。

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

Meta APIとGitHub台帳の各通信は10秒で打ち切り、結果が不明な場合は自動再送しません。コンテナ状態は1分間隔で最大5分待ち、公開API直前にも当日18:00以上22:00未満を再確認します。本番送信前には、公開JPEGのMeta側受理、画像寸法などの仕様、専用台帳ブランチ、Instagramのユースケース・権限、各媒体のOAuth結果を別途確認します。商業投稿には媒体の広告ラベル設定を送信時に確実に指定する別実装が必要です。X投稿とFacebook投稿は変更しません。

画像の事前検査基準: [Instagram IG User Media](https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media)、[Threads API overview](https://developers.facebook.com/documentation/threads/overview)。
