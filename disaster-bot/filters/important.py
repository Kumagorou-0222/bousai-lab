from config import AUTO_POST_KEYWORDS, TARGET_AREAS

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

# 重要度レベル定義
# レベル3（最重大）: 緊急自動投稿候補
LEVEL3_KEYWORDS = [
    "大津波警報",
    "津波警報",
    "緊急地震速報",
    "震度6弱",
    "震度6強",
    "震度7",
    "大雨特別警報",
    "暴風特別警報",
    "特別警報",
    "氾濫発生情報",
    "噴火警報",
]

# レベル2（重大）: Telegram通知 + Xボタン表示
LEVEL2_KEYWORDS = [
    "震度4",
    "震度5弱",
    "震度5強",
    "津波注意報",
    "土砂災害警戒情報",
    "記録的短時間大雨情報",
    "洪水警報",
    "氾濫危険情報",
    "暴風警報",
    "高潮警報",
    "台風",
    "竜巻注意情報",
    "噴火速報",
]

# レベル1（注意）: Telegram通知のみ（Xボタンなし）
LEVEL1_KEYWORDS = [
    "大雨警報",
    "大雪特別警報",
    "波浪特別警報",
    "暴風雪特別警報",
    "高潮特別警報",
]


def get_level(title: str, full_text: str) -> int:
    """重要度レベルを返す（3が最重大、0は通知不要）"""
    text = f"{title} {full_text}"
    if any(kw in text for kw in LEVEL3_KEYWORDS):
        return 3
    if any(kw in text for kw in LEVEL2_KEYWORDS):
        return 2
    if any(kw in text for kw in LEVEL1_KEYWORDS):
        return 1
    return 0


def is_notify_entry(title: str, full_text: str) -> bool:
    """通知すべきか判定（レベル1以上）"""
    text = f"{title} {full_text}"
    return any(kw in text for kw in NOTIFY_KEYWORDS)


def is_target_area(full_text: str) -> bool:
    """対象地域フィルター。TARGET_ARESが空なら全国対象。"""
    if not TARGET_AREAS:
        return True
    return any(area in full_text for area in TARGET_AREAS)


def is_auto_post_entry(title: str, full_text: str) -> bool:
    """完全自動X投稿してよいか判定（厳しい条件のみ）"""
    text = f"{title} {full_text}"
    return any(kw in text for kw in AUTO_POST_KEYWORDS)
