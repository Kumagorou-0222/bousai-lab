import requests
from config import LINE_CHANNEL_ACCESS_TOKEN, LINE_USER_ID


def notify_line(text: str) -> None:
    """LINE Messaging API でプッシュメッセージを送信する"""
    if not LINE_CHANNEL_ACCESS_TOKEN or not LINE_USER_ID:
        print("[LINE通知スキップ] LINE_CHANNEL_ACCESS_TOKEN または LINE_USER_ID が未設定です")
        return

    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {LINE_CHANNEL_ACCESS_TOKEN}",
    }
    payload = {
        "to": LINE_USER_ID,
        "messages": [
            {
                "type": "text",
                "text": text,
            }
        ],
    }
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=10)
        resp.raise_for_status()
        print("[LINE通知完了]")
    except requests.RequestException as e:
        print(f"[LINE通知失敗] {e}")
