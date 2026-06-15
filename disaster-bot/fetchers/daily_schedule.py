"""
disaster-bot/fetchers/daily_schedule.py

Vercel にデプロイされた /api/daily-schedule から
今日の朝昼夜投稿文を取得する。
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()


SITE_BASE_URL = "https://bousai-lab.vercel.app"
_ENDPOINT = f"{SITE_BASE_URL}/api/daily-schedule"

# スロット名の読み替え（ローカル呼び名 → API のキー）
_SLOT_ALIAS = {
    "morning": "morning",
    "noon":    "noon",
    "evening": "night",   # scheduled_post_runner は "evening"、APIは "night"
}


def fetch_today_post(slot: str) -> dict:
    """
    slot: "morning" / "noon" / "evening"
    戻り値: {"slug": ..., "title": ..., "text": ...}
    失敗時は RuntimeError を送出
    """
    secret = os.getenv("NOTIFY_SECRET", "")
    if not secret:
        raise RuntimeError("NOTIFY_SECRET が .env に未設定です")

    api_slot = _SLOT_ALIAS.get(slot)
    if api_slot is None:
        raise ValueError(f"不明なスロット: {slot}")

    resp = requests.get(_ENDPOINT, params={"secret": secret}, timeout=10)
    if resp.status_code == 401:
        raise RuntimeError("NOTIFY_SECRET が一致しません（認証失敗）")
    resp.raise_for_status()

    data = resp.json()
    schedule = data.get("schedule", {})
    post = schedule.get(api_slot)
    if not post:
        raise RuntimeError(f"スロット '{api_slot}' の投稿が見つかりません: {data}")

    return post
