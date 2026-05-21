import requests
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SITE_URL, SITE_BASE_URL
from storage.state import add_pending_post

TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


def _send_manga_album(manga_slug: str) -> None:
    """4コマ漫画パネルをアルバムとして送信する。"""
    panel_urls = [
        f"{SITE_BASE_URL}/manga/{manga_slug}/panel-0{i}.png"
        for i in range(1, 5)
    ]
    media = [{"type": "photo", "media": url} for url in panel_urls]
    try:
        resp = requests.post(
            f"{TELEGRAM_API}/sendMediaGroup",
            json={"chat_id": TELEGRAM_CHAT_ID, "media": media},
            timeout=20,
        )
        resp.raise_for_status()
        print(f"[Telegram漫画送信完了] {manga_slug}")
    except requests.RequestException as e:
        print(f"[Telegram漫画送信失敗] {manga_slug}: {e}")


def notify_telegram(
    text: str,
    x_intent_url: str = "",
    pending_post_text: str = "",
    manga_slug: str = "",
) -> None:
    """Telegram Bot でメッセージを送信する。

    x_intent_url     : Xで投稿するボタン（ブラウザで開く）
    pending_post_text: DBに保存し「投稿」返信でX API投稿する文章
    manga_slug       : 4コマ漫画のスラッグ（指定時はアルバムも送信）
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[Telegram通知スキップ] TELEGRAM_BOT_TOKEN または TELEGRAM_CHAT_ID が未設定です")
        return

    if pending_post_text:
        add_pending_post(pending_post_text)
        text = text + "\n\n📤 「投稿」と返信するとXにAPI投稿されます。"

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
        resp = requests.post(f"{TELEGRAM_API}/sendMessage", json=payload, timeout=10)
        resp.raise_for_status()
        print("[Telegram通知完了]")
    except requests.RequestException as e:
        print(f"[Telegram通知失敗] {e}")
        raise

    if manga_slug:
        _send_manga_album(manga_slug)
