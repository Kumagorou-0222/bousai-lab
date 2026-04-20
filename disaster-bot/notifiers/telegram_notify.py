import requests
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SITE_URL


def notify_telegram(text: str, x_intent_url: str = "") -> None:
    """Telegram Bot でメッセージを送信する。x_intent_urlを渡すとボタンが付く。"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[Telegram通知スキップ] TELEGRAM_BOT_TOKEN または TELEGRAM_CHAT_ID が未設定です")
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload: dict = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
    }

    if x_intent_url:
        payload["reply_markup"] = {
            "inline_keyboard": [
                [{"text": "𝕏 で投稿する", "url": x_intent_url}],
                [{"text": "サイトを見る", "url": SITE_URL}],
            ]
        }

    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        print("[Telegram通知完了]")
    except requests.RequestException as e:
        print(f"[Telegram通知失敗] {e}")
