import requests
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID


def notify_telegram(text: str) -> None:
    """Telegram Bot でメッセージを送信する"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[Telegram通知スキップ] TELEGRAM_BOT_TOKEN または TELEGRAM_CHAT_ID が未設定です")
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        print("[Telegram通知完了]")
    except requests.RequestException as e:
        print(f"[Telegram通知失敗] {e}")
