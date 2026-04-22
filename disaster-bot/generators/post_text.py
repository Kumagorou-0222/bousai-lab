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

自治体の情報に従い
直ちに避難"""

    elif "土砂" in text:
        post = f"""⚠️【土砂災害警戒情報】

{area_line}

山・崖沿いから離れ
安全な場所へ移動してください"""

    elif "氾濫発生" in text or "氾濫危険" in text:
        post = f"""🚨【洪水・氾濫情報】

{area_line}

川の近くは今すぐ離れて
高い場所に避難を"""

    elif "洪水" in text or "記録的短時間大雨" in text:
        post = f"""⚠️【大雨・洪水情報】

{area_line}

河川の増水に注意
低地・地下は危険

避難指示を確認"""

    elif "台風" in text or "暴風" in text:
        post = f"""🌀【台風・暴風情報】

{area_line}

外出は危険
窓から離れ
頑丈な建物の中心へ

自治体の避難指示を確認"""

    elif "高潮" in text:
        post = f"""🚨【高潮警報】

{area_line}

海岸・低地は今すぐ離れて
浸水前に避難を"""

    elif "竜巻" in text:
        post = f"""🌪️【竜巻注意情報】

{area_line}

頑丈な建物の中心・窓から離れた場所へ
発生したら即座に低い姿勢で頭を守る"""

    elif "噴火" in text:
        post = f"""🌋【噴火情報】

{area_line}

火口から離れ
降灰・噴石に注意

気象庁の情報を確認"""

    else:
        post = f"""【災害情報】

{area_line}

安全確保を優先
自治体の情報に従ってください"""

    return trim_post(post)


def generate_short_post(title: str, full_text: str) -> str:
    """短文版（100文字以内）— 速報性重視"""
    text  = f"{title} {full_text}"
    area  = extract_area(text) or "詳細確認中"
    scale = extract_scale(text)
    scale_part = f" {scale}" if scale else ""

    if "大津波" in text:
        core = f"🚨大津波警報 {area} 今すぐ高台へ"
    elif "津波警報" in text:
        core = f"🚨津波警報 {area} 今すぐ避難"
    elif "津波注意" in text:
        core = f"⚠️津波注意報 {area} 海岸から離れて"
    elif "緊急地震速報" in text:
        core = f"🚨緊急地震速報{scale_part} {area} 今すぐ身を守って"
    elif any(kw in text for kw in ["震度4","震度5","震度6","震度7"]):
        core = f"【地震{scale_part}】{area} 頭を守る・火の元確認"
    elif "特別警報" in text:
        core = f"🚨特別警報 {area} 命を守る行動を"
    elif "台風" in text or "暴風" in text:
        core = f"🌀台風・暴風警報 {area} 外出危険"
    elif "土砂" in text or "氾濫" in text or "洪水" in text:
        core = f"⚠️洪水・土砂危険 {area} 低地から離れて"
    elif "竜巻" in text:
        core = f"🌪️竜巻注意 {area} 頑丈な建物の中心へ"
    elif "噴火" in text:
        core = f"🌋噴火情報 {area} 火口から離れて"
    else:
        core = f"【災害情報】{area} 安全確保を"

    return trim_post(core, limit=100)


def build_telegram_message(title: str, full_text: str, level: int = 2) -> str:
    """Telegram向けメッセージ（B-3: 見やすい構成）"""
    text  = f"{title} {full_text}"
    area  = extract_area(text)
    scale = extract_scale(text)

    x_post     = generate_x_post(title, full_text)
    short_post = generate_short_post(title, full_text)

    # 震源・震度を別行で表示
    detail_lines = []
    if area:
        detail_lines.append(f"📍 震源・地域: {area}")
    if scale:
        detail_lines.append(f"📊 最大{scale}")
    detail_block = "\n".join(detail_lines) if detail_lines else ""

    # 概要は140文字に収める
    short_summary = full_text.strip()
    if len(short_summary) > 140:
        short_summary = short_summary[:140] + "…"

    # レベルに応じてヘッダーを変える
    level_label = {3: "🚨【緊急速報】", 2: "⚠️【災害速報】", 1: "ℹ️【気象情報】"}.get(level, "【情報】")

    parts = [f"{level_label}\n{title}"]
    if detail_block:
        parts.append(detail_block)
    parts.append(f"▶ 概要\n{short_summary}")
    parts.append(f"▶ 短文版（そのまま投稿可）\n{short_post}")
    if level >= 2:
        parts.append(f"▶ 詳細版\n{x_post}")

    return "\n\n".join(parts)


def build_x_intent_url(post_text: str) -> str:
    """X投稿画面を開くURLを生成する（投稿文をURLエンコードして渡す）"""
    encoded = quote(post_text)
    return f"https://x.com/intent/tweet?text={encoded}"
