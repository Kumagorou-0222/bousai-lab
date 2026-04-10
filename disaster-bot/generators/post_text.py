from config import SITE_URL

X_LIMIT = 280


def trim_post(text: str, limit: int = X_LIMIT) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "…"


def generate_x_post(title: str, summary: str) -> str:
    text = f"{title} {summary}"

    if "大津波警報" in text:
        post = f"""🚨【大津波警報】
{_short_title(title)}

今すぐ海・川から離れ
高台・避難場所へ移動してください

👉 避難の基本
{SITE_URL}"""

    elif "津波警報" in text:
        post = f"""🚨【津波警報】
{_short_title(title)}

海や川から離れ、
高い場所へすぐ避難してください

👉 避難の基本
{SITE_URL}"""

    elif "津波" in text:
        post = f"""⚠️【津波注意報】
{_short_title(title)}

海岸・川沿いにいる場合は
今すぐ離れてください

👉 避難の基本
{SITE_URL}"""

    elif "緊急地震速報" in text:
        post = f"""🚨【緊急地震速報】
{_short_title(title)}

頭を守り、低い姿勢で揺れに備えてください

👉 避難の基本
{SITE_URL}"""

    elif "地震" in text or "震度" in text:
        post = f"""【地震情報】
{_short_title(title)}

まず安全確保を優先してください
・落下物から頭を守る
・火の元を確認
・あわてて外に飛び出さない

👉 避難の基本
{SITE_URL}"""

    elif "特別警報" in text:
        post = f"""🚨【特別警報】
{_short_title(title)}

自治体の情報を確認し、
安全な場所で命を守る行動を

👉 避難の基本
{SITE_URL}"""

    elif "土砂" in text:
        post = f"""⚠️【土砂災害警戒情報】
{_short_title(title)}

山・崖沿いから離れ、
安全な場所へ移動してください

👉 避難の基本
{SITE_URL}"""

    else:
        post = f"""【災害情報】
{_short_title(title)}

まず公式情報を確認し、
安全を最優先に行動してください

👉 避難の基本
{SITE_URL}"""

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


def _short_title(title: str, limit: int = 40) -> str:
    """タイトルが長すぎる場合に省略する"""
    title = title.strip()
    if len(title) <= limit:
        return title
    return title[: limit - 1] + "…"
