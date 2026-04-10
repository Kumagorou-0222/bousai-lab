# disaster-bot セットアップ手順

気象庁XMLフィードを監視し、重要な災害情報をTelegramに通知するbotです。

---

## Telegram Bot の設定（5分）

### 1. BotFather でBotを作成

1. Telegramで `@BotFather` を検索して開く
2. `/newbot` と送信
3. Bot名を入力（例：`防災ラボ速報`）
4. ユーザー名を入力（例：`bousai_labot`）※末尾に `bot` 必須
5. 発行された **APIトークン**（`123456789:AABBcc...` の形式）をコピー
   → `TELEGRAM_BOT_TOKEN` に設定

### 2. 自分のチャットIDを取得

1. 作成したBotをTelegramで開いて `/start` と送信
2. ブラウザで以下のURLにアクセス（トークンを差し替えて）：
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
3. 表示されたJSONの `result[0].message.chat.id` の数値をコピー
   → `TELEGRAM_CHAT_ID` に設定

---

## GitHub Secrets に登録

リポジトリの Settings → Secrets and variables → Actions → New repository secret

| Secret名 | 値 |
|---|---|
| `TELEGRAM_BOT_TOKEN` | BotFatherから取得したトークン |
| `TELEGRAM_CHAT_ID` | 上記で取得した数値ID |
| `DISCORD_WEBHOOK_URL` | （任意）Discord Webhook URL |
| `AUTO_POST_ENABLED` | `false`（X自動投稿は現在オフ） |

---

## 通知フロー

```
気象庁XML（5分ごと）
    ↓ 震度4以上・津波・特別警報など検知
    ↓
Telegramに投稿文案が届く
    ↓
内容を確認して手動でXに投稿（@zaitaku_bousai）
```

## 通知対象の条件

- 緊急地震速報
- 震度4以上
- 津波注意報・警報・大津波警報
- 特別警報
- 土砂災害警戒情報
- 記録的短時間大雨情報

## ローカルテスト

```bash
cd disaster-bot
cp .env.example .env
# .env に値を記入
pip install -r requirements.txt
python main.py
```
