from config import AUTO_POST_KEYWORDS

# 通知対象キーワード
NOTIFY_KEYWORDS = [
    # 地震
    "緊急地震速報",
    "震度4",
    "震度5弱",
    "震度5強",
    "震度6弱",
    "震度6強",
    "震度7",
    # 津波
    "津波注意報",
    "津波警報",
    "大津波警報",
    # 特別警報・警報
    "特別警報",
    "暴風特別警報",
    "大雨特別警報",
    "高潮特別警報",
    "波浪特別警報",
    "暴風雪特別警報",
    "大雪特別警報",
    # 土砂・洪水
    "土砂災害警戒情報",
    "記録的短時間大雨情報",
    "洪水警報",
    "氾濫発生情報",
    "氾濫危険情報",
    # 台風・暴風
    "台風",
    "暴風警報",
    "高潮警報",
    # 竜巻
    "竜巻注意情報",
    # 火山
    "噴火警報",
    "噴火速報",
]


def is_notify_entry(title: str, full_text: str) -> bool:
    """通知すべきか判定（震度4以上・津波・特別警報など）"""
    text = f"{title} {full_text}"
    return any(kw in text for kw in NOTIFY_KEYWORDS)


def is_auto_post_entry(title: str, full_text: str) -> bool:
    """完全自動X投稿してよいか判定（厳しい条件のみ）"""
    text = f"{title} {full_text}"
    return any(kw in text for kw in AUTO_POST_KEYWORDS)
