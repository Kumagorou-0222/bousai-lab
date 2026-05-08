import os
from dotenv import load_dotenv

load_dotenv()

# 対象地域フィルター（空リストなら全国対象）
# 例: ["東京", "神奈川", "埼玉", "千葉"]
_areas_env = os.getenv("TARGET_AREAS", "")
TARGET_AREAS: list[str] = [a.strip() for a in _areas_env.split(",") if a.strip()]

# 気象庁XMLフィード
JMA_EQVOL_FEED = "https://www.data.jma.go.jp/developer/xml/feed/eqvol.xml"
JMA_REGULAR_FEED = "https://www.data.jma.go.jp/developer/xml/feed/regular.xml"

SITE_URL = "https://bousai-lab.vercel.app/category/evacuation"

# Discord Webhook
DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL", "")

# Telegram Bot
# 取得方法は README を参照
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID   = os.getenv("TELEGRAM_CHAT_ID", "")  # 自分のチャットID

# X API
X_CONSUMER_KEY        = os.getenv("X_CONSUMER_KEY", "")
X_CONSUMER_SECRET     = os.getenv("X_CONSUMER_SECRET", "")
X_ACCESS_TOKEN        = os.getenv("X_ACCESS_TOKEN", "")
X_ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET", "")

# 完全自動投稿フラグ（デフォルト: off）
# 有効にすると AUTO_POST_KEYWORDS に一致した場合のみX自動投稿
AUTO_POST_ENABLED = os.getenv("AUTO_POST_ENABLED", "false").lower() == "true"

# 完全自動投稿を許可するキーワード（重大災害のみ・AUTO_POST_ENABLED=trueの場合に使用）
AUTO_POST_KEYWORDS = [
    "緊急地震速報",
    "震度5弱",
    "震度5強",
    "震度6弱",
    "震度6強",
    "震度7",
    "津波警報",
    "大津波警報",
    "特別警報",
    "氾濫発生情報",
    "噴火警報",
]
