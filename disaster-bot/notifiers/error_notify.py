import requests
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID


def notify_error(title: str, error: Exception) -> None:
    """エラー内容をTelegramに通知する。通知自体が失敗してもクラッシュしない。"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print(f"[エラー通知スキップ] {title}: {error}")
        return

    text = f"⚠️【システムエラー】\n{title}\n\n{type(error).__name__}: {error}"
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        requests.post(url, json={"chat_id": TELEGRAM_CHAT_ID, "text": text}, timeout=10)
    except Exception as e:
        print(f"[エラー通知失敗] {e}")
    print(f"[ERROR] {title}: {error}")
