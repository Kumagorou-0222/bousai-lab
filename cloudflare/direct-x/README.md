# Xの外部直接実行 — 安全性の下書き

このディレクトリは、GitHub Actionsのrunnerを通さずCloudflare WorkerからXへ直接投稿する方式の**未完成の下書き**です。現行の本番投稿には使われていません。現在の `worker.mjs` は時刻を判定してdry-runログだけを出し、`DRY_RUN=false` でも未接続エラーで停止します。資格情報・実投稿API・デプロイ設定はまだ接続しません。

## 投稿予定と実行時の制限

- 朝は07:00、07:15、07:30 JSTに起動候補。送信できるのは当日07:00以上12:00未満。
- 昼は12:00、12:15、12:30 JSTに起動候補。送信できるのは当日12:00以上18:00未満。
- 夜は18:00〜21:45 JSTの15分間隔と21:55に起動候補。送信できるのは承認素材の当日18:00以上22:00未満のみ。
- 投稿予定と実際の時刻を別々に検査し、翌日への繰り越しはしません。朝昼の時間窓は直接方式の提案であり、現行GitHub workflowには適用していません。
- Cron Triggerは4件、最大23回/日です。Cloudflare無料プランのアカウントあたり5件という上限内ですが、既存アカウントの使用数とCPU10ms以内の実測は未確認です。

## 候補と共有予約

`scripts/buildXDayCandidates.ts` は既存の `getAllArticlesMeta`、`buildPriorityCandidates`、`applySlotLabel`、`generateHashtags`、`applyHashtags` で24件の候補マニフェストを生成します。武蔵野市の記事も保持します。画像は生成時にSHA-256とPNG寸法を記録し、Worker側で取得時に再照合します。**生成物の本番公開・記事変更時の更新経路は未接続**です。

夜は `candidate-source.mjs` が `data/x-night-approved.json` から当日1件だけを選び、画像SHA-256・PNG寸法を確認します。`publisher.mjs` は画像アップロード後にALTを設定してから送信する接続口で、モックのみでテストしています。`oauth1.mjs` と `x-api.mjs` にOAuth 1.0a署名、画像アップロード、ALT登録、投稿APIの接続口を用意し、偽の認証情報とモック通信で確認しています。本番Workerへの接続と実API互換性の検証は未実施です。

`core.mjs` は、送信より先に `data/x-post-history.json` に予約を記録します。`github-store.mjs` はGitHub Contents APIのファイルSHAを指定して更新し、競合したら再読します。既存の投稿成功・予約・結果不明を同日同枠の重複として扱います。X送信後のtimeoutは「結果不明」のまま保持し、自動再送しません。送信成功後の履歴確定に失敗した場合も予約を保持して人が照合します。GitHub履歴とX APIを単一トランザクションにはできず、「必ず1回」の保証はありません。

朝昼の現行GitHub workflowには送信前予約がないため、直接方式の有効化前に旧cronの停止と既に遅延中のrunの確認が必要です。夜も旧cronとの競合を避けるため、移行手順を別PRで確認します。緊急投稿と地域設定は変更しません。

## 資格情報と本番化の保留

本番Workerには既存のX認証情報4点をCloudflare Worker Secretsへ安全に入力する必要があります。GitHub Secretsから値は取得できず、指定された単一 `.env` で `X_CONSUMER_KEY`、`X_CONSUMER_SECRET`、`X_ACCESS_TOKEN`、`X_ACCESS_TOKEN_SECRET` の非空存在のみ確認しました。Workerの想定名 `X_API_KEY`、`X_API_SECRET`、`X_ACCESS_TOKEN`、`X_ACCESS_SECRET` に順に対応します。値は読み出し・保存していません。さらに `Kumagorou-0222/bousai-lab` のみを対象にした期限付き `Contents: write` の認証情報をCloudflare Worker Secretsへ保存します。この権限は履歴ファイルだけには限定できません。秘密値はリポジトリやログへ記録しません。

Cloudflare画面でWorkers Freeが有効、支払方法未登録と確認しました。無料枠のCPU上限で実際に動くかdry-runの性能試験後に判断し、有料化が必要なら停止します。実投稿をテストとして行いません。

## 秘密値不要のテスト

```sh
node --test tests/cloudflareDirectX.test.mjs tests/cloudflareDirectXGithubStore.test.mjs tests/cloudflareDirectXCandidateSource.test.mjs tests/cloudflareDirectXOAuth.test.mjs tests/cloudflareDirectXApi.test.mjs
```

時刻・日付・重複・GitHub CAS競合・送信timeout・送信直前の時間切れをモックで確認します。
