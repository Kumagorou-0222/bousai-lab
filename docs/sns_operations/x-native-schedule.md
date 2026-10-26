# Xの通常投稿と予約記録

朝07:00、昼12:00、夜18:00の通常投稿は、Xの画面で直接予約します。時刻は日本時間です。緊急投稿は従来の別workflowを使います。

予約できたら `data/x-native-schedule.json` に日付ごと・枠ごとに1件を記録します。過去の投稿履歴は削除しません。記録は次の形式です。

```json
{
  "dateJst": "2026-10-27",
  "slot": "morning",
  "scheduledForJst": "2026-10-27T07:00:00+09:00",
  "status": "scheduled",
  "slug": "記事スラッグ",
  "imageId": null,
  "text": "予約した投稿文",
  "imagePath": "/manga/example/panel-01.png",
  "altText": "画像に設定したALT。画像がなければnull",
  "scheduleConfirmation": "Xの予約一覧で確認した日時と識別情報",
  "postUrl": null,
  "postedAtJst": null
}
```

Xで公開を確認したら同じ記録を `status: "posted"` に更新し、`postUrl` を記入します。実際の公開時刻が確認できた場合は `postedAtJst` に別記します。予約一覧から消えただけでは投稿済みと扱いません。結果が不明なら `status: "unknown"` として確認し、同じ日・枠の再予約を止めます。夜の予約時刻は当日18:00以上22:00未満とし、当日承認済みの画像・投稿文・ALTだけを使い、翌日に繰り越しません。朝昼の予約時刻は07:00と12:00のままです。朝昼の素材も実際の予約画面で本文と画像を確認します。過去の `data/x-post-history.json` は保持し、確認できた投稿結果だけを追記します。

GitHubの通常投稿workflowは定時送信を行いません。旧版の実行が残っている間は予約前に実行状態とXの投稿結果を確認し、重複を防ぎます。

記録後に `node scripts/check-x-native-schedule.mjs` を実行し、同日同枠の重複、時刻、画像ALT、予約確認、公開後URLを検査します。
