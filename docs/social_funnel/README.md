# SNSから記事・商品への導線

## 実装

- `/social-drafts` に記事ごとのX・Threads・Instagram投稿案を表示します。X・Threadsは記事へのUTM付きURL、Instagramはプロフィールの `/from/instagram` から記事へ誘導します。投稿案ページから送信しません。
- `/from/instagram` は全記事を掲載し、古い投稿からも記事名で探せます。各記事にInstagram用UTMを付けます。プロフィールのリンクはアカウント管理者が設定する必要があります。
- 記事の備品リスト・商品カードは既存の文脈に応じて表示し、関連書籍の検索リンクを加えました。特定書籍の品質や在庫は確認済みと表示しません。
- GA4の既存ページビューで `utm_source`・`utm_campaign` 別の流入を確認できます。検証済みの媒体・campaign・contentだけを同じタブのsessionStorageに残し、内部記事へ移動した後のAmazon・楽天ROOMクリックも `affiliate_click` イベントで分類します。個人識別子は保存しません。クリックは注文や紹介料を意味しません。購入・紹介料は各アフィリエイト管理画面で別途確認します。
- 停止済みAmazonタグは、生成リンク・記事の固定URL・サイト全体の付与スクリプトから除去しました。MDXの記事リンクもサーバー側でhrefを確定します。`NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` に加えて、管理画面でタグ利用可否を確認した担当者が `NEXT_PUBLIC_AMAZON_TAG_USABLE=true` を設定するまでAmazonリンクはタグなしです。新申請タグの記録はありますが、管理画面での現況は未確認です。新タグはこのリポジトリに書かないでください。
- `lib/metaPublisher.ts` はThreads・Instagram送信アダプターです。`docs/meta_auto_post/README.md` の承認台帳とdry-run既定の専用workflowが追加されています。全体と媒体別の有効化、期限が7日超残るトークン、専用のGitHub台帳ブランチが揃わないと送信しません。送信前に媒体・記事・campaignのキーをGitHub台帳へ作成専用操作で予約し、作成したコンテナIDを公開前に保存します。競合や結果不明時は予約を残して再送を停止します。Instagramには公開画像URLと確認済みの `META_GRAPH_VERSION` も必要です。OAuth取得・トークン更新・実送信は未実装または未検証です。
- Threadsは `POST /{user-id}/threads` のテキストまたは画像コンテナ作成と `POST /{user-id}/threads_publish` の2段階です。即時公開の `auto_publish_text` は指定しません。Instagramは `POST /{user-id}/media` と `POST /{user-id}/media_publish` を呼びます。どちらもコンテナIDを保存後、Threadsは `status`、Instagramは `status_code` が `FINISHED` になるまで初回と1分間隔の再確認5回（最大約5分）待ち、`IN_PROGRESS` 以外の未準備状態と期限切れは公開せず停止します。実認証・実送信の確認は残っています。

## 公開前の確認

1. Amazon管理画面でアカウントの現況と新申請タグの利用可否を確認してから、環境変数を設定し、リンクと参加者表示を確認する。最終審査完了を一律の前提にしない。停止済みIDを使わない。
2. Instagramプロフィールに `/from/instagram` を登録する。Instagram Loginはプロアカウントと `instagram_business_basic`・`instagram_business_content_publish` が必要です。Threads・InstagramのOAuth、公開アカウントID、画像要件をMetaの現行資料とテスト環境で確認する。Facebook Loginのトークンと混用しない。
3. GA4でUTM付き記事ビューと `affiliate_click` の受信を確認し、Amazon管理画面の注文・紹介料とは区別して集計する。
4. Meta投稿を有効にする際は、mainを基点とする専用ブランチ `social-ledger` を作成し、`SOCIAL_LEDGER_BRANCH=social-ledger` を設定する。workflowでは組み込みGitHubトークンを投稿台帳に用いる。Vercel管理画面のIgnored Build Stepは現在Automaticであり、台帳ブランチの不要なデプロイ防止は保証できない。mainに台帳を書かない。担当者が画像と本文を承認してから送信する。Facebookには投稿しない。Xの既存投稿workflowは変更しない。

Meta APIとGitHub台帳の各通信には10秒のタイムアウトがあります。コンテナ準備の判定は初回と1分間隔の再確認5回で最大約5分待つ設計で、ネットワーク待機時間は別にかかります。本番送信の有効化前に全体実行時間の上限を確認する必要があります。

## 結果不明時の復旧

1. 自動再送はしない。`social-ledger` の `.social-post-ledger/{channel}/{slug}/{campaign}.json` を読み、`reserved`・`container_ready`・`published` とコンテナID、投稿IDを確認する。`inspectPostReservation` は台帳とMeta状態を読み取るだけで、投稿しない。
2. `reserved` のままならコンテナ作成の応答が不明か、台帳へのコンテナID記録に失敗した可能性がある。Metaの投稿一覧と該当時刻を担当者が照合する。IDがない場合も同じキーを自動再作成しない。
3. `container_ready` なら保存済みIDをMetaに照会する。Threadsは `GET /{container-id}?fields=id,status,error_message`、Instagramは `GET /{container-id}?fields=id,status_code`。`FINISHED` でも公開操作が未実行と断定せず、投稿一覧も確認する。`PUBLISHED` や投稿が見つかった場合は投稿IDを確定して台帳を修復する。`ERROR`・`EXPIRED`・期限切れの場合も担当者の判断まで予約を残す。
4. `PostRecordError` が出た場合はエラー中の投稿IDを保全し、Metaの投稿一覧で公開を確認してから台帳を `published` に修復する。GitHub APIのGETで最新SHAを取得し、内容の `status`、`postId`、`publishedAt` を更新する。復旧作業中も `SOCIAL_PUBLISH_ENABLED` は無効にし、修復後に重複投稿がないことを確認する。

参照: [Amazonアソシエイト運営規約](https://affiliate.amazon.co.jp/help/operating/agreement)、[Amazon申請審査](https://affiliate.amazon.co.jp/help/node/topic/G8TW5AE9XL2VX9VM)、[Threads投稿API](https://www.postman.com/meta/threads/request/34203612-c940a17f-e719-4b5b-9d28-7390bc658fb7)、[Instagram Login API](https://www.postman.com/meta/instagram/folder/6raa77c/instagram-api-with-instagram-login)。Metaの認証・実送信は未検証です。
