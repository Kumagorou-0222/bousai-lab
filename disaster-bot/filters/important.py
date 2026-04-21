from config import AUTO_POST_KEYWORDS

# 通知対象キーワード（Discordに通知する閾値）
NOTIFY_KEYWORDS = [
    "緊急地震速報",
    "震度4",
    "震度5弱",
    "震度5強",
    "震度6弱",
    "震度6強",
    "震度7",
    "津波注意報",
    "津波警報",
    "大津波警報",
    "特別警報",
    "土砂災害警戒情報",
    "記録的短時間大雨情報",
]


def is_notify_entry(title: str, full_text: str) -> bool:
    """通知すべきか判定（震度4以上・津波・特別警報など）"""
    text = f"{title} {full_text}"
    return any(kw in text for kw in NOTIFY_KEYWORDS)


def is_auto_post_entry(title: str, full_text: str) -> bool:
    """完全自動X投稿してよいか判定（厳しい条件のみ）"""
    text = f"{title} {full_text}"
    return any(kw in text for kw in AUTO_POST_KEYWORDS)
