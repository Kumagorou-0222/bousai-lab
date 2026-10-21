# 夜枠の外部起動（導入前の準備）

`cloudflare/night-dispatcher/` は Cloudflare Workers の Cron Trigger `0 11 * * *`（UTC、毎日20:00 JST）から、`Kumagorou-0222/bousai-lab` の既存 `x-auto-post.yml` に `workflow_dispatch` の `slot=night` を送るための小さな Worker です。画像や投稿本文は Worker に渡しません。

Cloudflare の起動も GitHub の実行開始も20:00ちょうどを保証しません。Worker は予定時刻と実行時刻を JST で記録し、当日20:00以上22:00未満だけ起動要求を出します。GitHub 側でも同じ時間帯、当日承認画像とハッシュ、投稿履歴、投稿前予約、結果不明時の再送禁止を検査します。既存 GitHub 夜枠 cron（20:00、20:35、21:35 JST）は残すため、二つの起動元が重なっても GitHub workflow の concurrency と予約で投稿の重複を防ぎます。朝昼・緊急枠・地域設定は変更しません。

## 現在の状態とローカル検証

`wrangler.jsonc` は `DRY_RUN=true` です。この状態では GitHub へ通信しません。認証情報を設定せずに、リポジトリのルートから次でテストできます。

```sh
node --test tests/cloudflareNightDispatcher.test.mjs tests/xNightPost.test.mjs
```

GitHub の固定 HTTPS エンドポイントにのみPOSTし、リダイレクトを追跡しません。ログには予定・実行時刻、遅延秒数、結果、HTTPステータスだけを残し、認証情報、応答本文、例外本文は残しません。GitHub API が要求を受け付けたことは投稿成功を意味しないため、導入後は Actions の実行と `data/x-post-history.json` を照合します。

## 本番導入時に残る操作

以下は**まだ実施していません**。Cloudflareアカウントへのログイン、Workerのデプロイ、認証キーの作成・入力、有効化はそれぞれ必要な承認とボス本人の安全な操作を経て行います。

1. Cloudflare Workers Free の利用状況とCron枠を確認する。Cloudflareの無料枠には上限があり、Cron Triggerはアカウント当たり最大5件です。新規サービスや有料契約を自動で作りません。[Cloudflareの料金](https://developers.cloudflare.com/workers/platform/pricing/)・[上限](https://developers.cloudflare.com/workers/platform/limits/)
2. 承認後、`npx wrangler deploy --config cloudflare/night-dispatcher/wrangler.jsonc` で **dry-run のまま** Worker を配置し、予定時刻・実行時刻と「ドライラン: 起動要求なし」を確認する。Cron設定の反映には最大約15分かかることがあります。[Cloudflare Cron Trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
3. 別途キー作成の承認を得た後、ボス本人が GitHub の fine-grained PAT を対象リポジトリ **`Kumagorou-0222/bousai-lab` のみ**に限定し、`Actions: write` を与え、期限を短く設定する。`Actions: write` は**個別workflowだけには限定できず**、対象リポジトリ内の他のActions操作も許す権限です。Workerの固定宛先は漏えいしたキーの権限自体を狭めません。[GitHub workflow dispatch API](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event)・[トークン管理](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
4. ボス本人がCloudflareのSecret `GITHUB_DISPATCH_TOKEN` に安全に入力する。値をチャット、PR、設定ファイル、シェル履歴、ログへ貼らない。Wranglerを使う場合は `npx wrangler secret put GITHUB_DISPATCH_TOKEN --config cloudflare/night-dispatcher/wrangler.jsonc` の対話入力を使う。
5. 別途本番有効化の承認を得て `DRY_RUN` を `false` に変更・デプロイし、翌日の Actions run と履歴を読み取り確認する。今夜分の手動投稿や過去素材の持ち越しはしない。既存GitHub cronの停止は本変更に含まない。

## 既存夜枠との切替確認

既存 workflow は20:00、20:35、21:35 JSTの3つの夜枠起動を持ち、朝昼枠も同じファイルにあります。Workerを有効化すると20:00 JSTの起動要求が追加されますが、投稿判定は既存 workflow 内で行います。`concurrency.group: x-auto-post-main` は同時実行を直列化し、夜枠の投稿前予約・同日承認画像・投稿履歴の照合が二重投稿を防ぐ条件です。Actionsの実行順序やCloudflareの起動時刻だけに重複防止を依存しません。

切替時は、まずdry-runのログだけを確認します。その後、別途有効化が認められた場合に限り、既存cronを維持したまま一日分のWorker起動、Actions実行、当日の投稿予約とX投稿IDを照合します。通信結果が不明、予約が残る、または重複実行の扱いが確認できない日は再送せず、次の有効化や既存cronの変更を保留します。既存cronの停止や削除は独立した変更として、朝昼枠への影響と夜枠の代替起動が確認できてから判断します。
