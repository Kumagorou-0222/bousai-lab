from datetime import datetime
from zoneinfo import ZoneInfo


def emergency_x_hours(now: datetime | None = None) -> bool:
    """緊急X投稿を許可する日本時間か確認する。"""
    current = now or datetime.now(ZoneInfo("Asia/Tokyo"))
    local = current.astimezone(ZoneInfo("Asia/Tokyo"))
    return 8 <= local.hour < 22
