import requests
from config import DISCORD_WEBHOOK_URL


def notify_discord(text: str, title: str = "") -> None:
    if not DISCORD_WEBHOOK_URL:
        return

    header = f"**📢 投稿候補**\n`{title}`\n\n" if title else "**📢 投稿候補**\n\n"
    payload = {
        "content": f"{header}```\n{text}\n```\n文字数: {len(text)}/280",
    }
    try:
        resp = requests.post(DISCORD_WEBHOOK_URL, json=payload, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"[Discord通知失敗] {e}")
