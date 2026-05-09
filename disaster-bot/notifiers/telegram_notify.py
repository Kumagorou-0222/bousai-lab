import requests
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SITE_URL
from storage.state import add_pending_post


def notify_telegram(
    text: str,
    x_intent_url: str = "",
    pending_post_text: str = "",
) -> None:
    """Telegram Bot でメッセージを送信する。

    x_intent_url   : Xで投稿するボタン（ブラウザで開く）
    pending_post_text: DBに保存し「投稿」返信でX API投稿する文章
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[Telegram通知スキップ] TELEGRAM_BOT_TOKEN または TELEGRAM_CHAT_ID が未設定です")
        return

    if pending_post_text:
        add_pending_post(pending_post_text)
        text = text + "\n\n📤 「投稿」と返信するとXにAPI投稿されます。"

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

    buttons = []
    if x_intent_url:
        buttons.append([{"text": "𝕏 で投稿する", "url": x_intent_url}])
    buttons.append([{"text": "サイトを見る", "url": SITE_URL}])

    payload: dict = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "reply_markup": {"inline_keyboard": buttons},
    }

    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        print("[Telegram通知完了]")
    except requests.RequestException as e:
        print(f"[Telegram通知失敗] {e}")
        raise
