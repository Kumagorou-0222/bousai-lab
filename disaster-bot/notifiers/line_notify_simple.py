import requests
import os

def notify_line(message: str, image_path: str = None) -> bool:
    """
    LINE Notifyを使用してメッセージを送信する
    """
    token = os.getenv("LINE_NOTIFY_TOKEN")
    if not token:
        return False

    url = "https://notify-api.line.me/api/notify"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"message": message}
    
    files = None
    if image_path and os.path.exists(image_path):
        files = {"imageFile": open(image_path, "rb")}

    try:
        response = requests.post(url, headers=headers, data=payload, files=files, timeout=10)
        response.raise_for_status()
        print("[LINE通知完了]")
        return True
    except Exception as e:
        print(f"[LINE通知失敗] {e}")
        return False
    finally:
        if files:
            files["imageFile"].close()
