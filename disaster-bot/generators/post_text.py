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
    for pat in _AREA_PATTERNS:
        m = re.search(pat, text)
        if m:
            return m.group(1)
    return ""


def extract_scale(text: str) -> str:
    m = _SCALE_PATTERN.search(text)
    if m:
        return f"震度{m.group(1)}"
    return ""


def trim_post(text: str, limit: int = X_LIMIT) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "…"


def generate_x_post(title: str, full_text: str) -> str:
    text = f"{title} {full_text}"

    area  = extract_area(text) or "詳細確認中"
    scale = extract_scale(text)
    scale_str = f"震度{scale.replace('震度','')}" if scale else ""

    # ① 速報テンプレ：短く・命令形・行動明確
    if "大津波警報" in text:
        post = f"""🚨【大津波警報】

{area}

今すぐ逃げて
・海から離れる
・高い場所へ
・車は使わない

迷わないで"""

    elif "津波警報" in text:
        post = f"""🚨【津波警報】

{area}

今すぐ避難
・海から離れる
・高い場所へ

迷わないで"""

    elif "津波注意報" in text or "津波" in text:
        post = f"""⚠️【津波注意報】

{area}

海岸・川沿いから離れて
戻るな、待て

👉 {SITE_URL}"""

    elif "緊急地震速報" in text:
        post = f"""🚨【緊急地震速報】

{area}

今すぐ
・机の下へ
・頭を守る
・動かない"""

    elif "地震" in text or "震度" in text:
        scale_line = f"\n{area}で{scale_str}" if scale_str else f"\n{area}"
        post = f"""【地震情報】{scale_line}

まずこれ👇
・頭を守る
・火の元確認
・外に飛び出さない

👉 {SITE_URL}"""

    elif "特別警報" in text:
        post = f"""🚨【特別警報】

{area}

命を守る行動を今すぐ
・外出するな
・頑丈な建物の上階へ
・自治体の指示に従え"""

    elif "土砂" in text:
        post = f"""⚠️【土砂災害警戒情報】

{area}

山・崖から離れて
今すぐ安全な場所へ

迷ったら逃げる"""

    elif "氾濫発生" in text or "氾濫危険" in text:
        post = f"""🚨【氾濫・洪水情報】

{area}

川から離れて
低地・地下に入るな
高い場所へ今すぐ"""

    elif "洪水" in text or "記録的短時間大雨" in text:
        post = f"""⚠️【大雨・洪水警戒】

{area}

・川に近づくな
・低地・地下は危険
・避難指示を確認

👉 {SITE_URL}"""

    elif "台風" in text or "暴風" in text:
        post = f"""🌀【台風・暴風警報】

{area}

外に出るな
・窓から離れる
・頑丈な建物の中心へ
・自治体の指示に従え"""

    elif "高潮" in text:
        post = f"""🚨【高潮警報】

{area}

海岸・低地から離れて
浸水前に避難
迷ったら逃げる"""

    elif "竜巻" in text:
        post = f"""🌪️【竜巻注意情報】

{area}

発生したら即行動
・頑丈な建物の中心へ
・窓から離れる
・低い姿勢で頭を守る"""

    elif "噴火" in text:
        post = f"""🌋【噴火情報】

{area}

火口から離れて
・降灰に備えマスクを
・噴石に注意
・気象庁情報を確認"""

    else:
        post = f"""【災害情報】

{area}

安全確保を優先
自治体の指示に従って

👉 {SITE_URL}"""

    return trim_post(post)


def generate_short_post(title: str, full_text: str) -> str:
    """短文版（100文字以内）— 速報性重視"""
    text  = f"{title} {full_text}"
    area  = extract_area(text) or "詳細確認中"
    scale = extract_scale(text)
    scale_part = f" {scale}" if scale else ""

    if "大津波" in text:
        core = f"🚨大津波警報 {area} 今すぐ高台へ逃げて"
    elif "津波警報" in text:
        core = f"🚨津波警報 {area} 今すぐ避難"
    elif "津波注意" in text:
        core = f"⚠️津波注意報 {area} 海岸から離れて"
    elif "緊急地震速報" in text:
        core = f"🚨緊急地震速報{scale_part} {area} 今すぐ身を守って"
    elif any(kw in text for kw in ["震度4","震度5","震度6","震度7"]):
        core = f"【地震{scale_part}】{area} 頭を守る・火の元確認"
    elif "特別警報" in text:
        core = f"🚨特別警報 {area} 命を守る行動を今すぐ"
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

    detail_lines = []
    if area:
        detail_lines.append(f"📍 震源・地域: {area}")
    if scale:
        detail_lines.append(f"📊 最大{scale}")
    detail_block = "\n".join(detail_lines)

    short_summary = full_text.strip()
    if len(short_summary) > 140:
        short_summary = short_summary[:140] + "…"

    level_label = {3: "🚨【緊急速報】", 2: "⚠️【災害速報】", 1: "ℹ️【気象情報】"}.get(level, "【情報】")

    parts = [f"{level_label}\n{title}"]
    if detail_block:
        parts.append(detail_block)
    parts.append(f"▶ 概要\n{short_summary}")
    parts.append(f"▶ 短文版\n{short_post}")
    if level >= 2:
        parts.append(f"▶ 詳細版\n{x_post}")

    return "\n\n".join(parts)


def build_x_intent_url(post_text: str) -> str:
    encoded = quote(post_text)
    return f"https://x.com/intent/tweet?text={encoded}"
