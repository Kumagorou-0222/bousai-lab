import re
from urllib.parse import quote

from config import SITE_URL

X_LIMIT = 280

# 震源地を抽出するパターン（気象庁フィードの典型的な表現）
_AREA_PATTERNS = [
    r"震源(?:地)?[はが]?[、\s]*([^\s、。,]+(?:沖|地方|県|半島|海域|付近))",
    r"([^\s、。,]+(?:沖|地方|県|半島|海域|付近))を震源",
]

# 震度を抽出するパターン
_SCALE_PATTERN = re.compile(r"(?:最大)?震度(\d+(?:弱|強)?)")


def extract_area(text: str) -> str:
    """震源地・地域名を抽出する。見つからなければ空文字を返す。"""
    for pat in _AREA_PATTERNS:
        m = re.search(pat, text)
        if m:
            return m.group(1)
    return ""


def extract_scale(text: str) -> str:
    """最大震度を抽出する。例: '震度5弱'。見つからなければ空文字。"""
    m = _SCALE_PATTERN.search(text)
    if m:
        return f"震度{m.group(1)}"
    return ""


def trim_post(text: str, limit: int = X_LIMIT) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "…"


def generate_x_post(title: str, summary: str) -> str:
    text = f"{title} {summary}"

    area  = extract_area(text)
    scale = extract_scale(text)

    area_line  = area  if area  else "詳細は気象庁情報を確認"
    scale_line = f"で{scale}" if scale else ""

    if "大津波警報" in text:
        post = f"""🚨【大津波警報】

{area_line}

今すぐ避難
・海から離れる
・高い場所へ

迷わないで"""

    elif "津波警報" in text:
        post = f"""🚨【津波警報】

{area_line}

今すぐ避難
・海から離れる
・高い場所へ

迷わないで"""

    elif "津波" in text:
        post = f"""⚠️【津波注意報】

{area_line}

海岸・川沿いにいる場合は
今すぐ離れてください"""

    elif "緊急地震速報" in text:
        post = f"""🚨【緊急地震速報】

{area_line}

頭を守り、低い姿勢で
揺れに備えてください"""

    elif "地震" in text or "震度" in text:
        post = f"""【地震情報】

{area_line}{scale_line}

まずこれ👇
・頭を守る
・火の元確認
・外に飛び出さない

👉 {SITE_URL}"""

    elif "特別警報" in text:
        post = f"""🚨【特別警報】

{area_line}

命を守る行動を
外出は危険

自治体情報を確認"""

    elif "土砂" in text:
        post = f"""⚠️【土砂災害警戒情報】

{area_line}

山・崖沿いから離れ
安全な場所へ移動してください"""

    else:
        post = f"""【災害情報】

{area_line}

安全確保を優先"""

    return trim_post(post)


def build_telegram_message(title: str, summary: str) -> str:
    x_post = generate_x_post(title, summary)

    short_summary = summary.strip()
    if len(short_summary) > 140:
        short_summary = short_summary[:140] + "…"

    return f"""【災害速報】
{title}

▶ 概要
{short_summary}

▶ X投稿案（コピペしてそのまま投稿可）
{x_post}
"""


def build_x_intent_url(post_text: str) -> str:
    """X投稿画面を開くURLを生成する（投稿文をURLエンコードして渡す）"""
    encoded = quote(post_text)
    return f"https://x.com/intent/tweet?text={encoded}"


def _short_title(title: str, limit: int = 40) -> str:
    """タイトルが長すぎる場合に省略する"""
    title = title.strip()
    if len(title) <= limit:
        return title
    return title[: limit - 1] + "…"
