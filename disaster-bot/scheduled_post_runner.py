"""
scheduled_post_runner.py — 朝・昼・夜の定時投稿案をTelegramに送信

・朝（08:00 JST）: 保存系
・昼（12:00 JST）: ストーリー系
・夜（20:00 JST）: まとめ系

テンプレートは通し日数 % 本数 で順番に選ぶ（重複なし）
Telegramに「Xで投稿する」ボタン付きで送信
X自動投稿は行わない（手動確認 → ワンクリック投稿）

使い方:
  python scheduled_post_runner.py morning
  python scheduled_post_runner.py noon
  python scheduled_post_runner.py evening
"""

import sys
from datetime import date

from content.scheduled_templates import MORNING, NOON, EVENING
from generators.post_text import build_x_intent_url
from notifiers.telegram_notify import notify_telegram
from notifiers.error_notify import notify_error

SLOT_MAP = {
    "morning": ("朝の防災メモ", "📌", MORNING),
    "noon":    ("昼の防災ストーリー", "💬", NOON),
    "evening": ("夜の防災まとめ", "🌙", EVENING),
}


def pick_template(templates: list[str]) -> str:
    """通し日数 % 本数 で順番に選ぶ（日付が変われば次の投稿文になる）"""
    day_of_year = date.today().timetuple().tm_yday
    index = day_of_year % len(templates)
    return templates[index]


def run(slot: str) -> None:
    if slot not in SLOT_MAP:
        print(f"[ERROR] 不明なスロット: {slot}  使い方: morning / noon / evening")
        sys.exit(1)

    label, icon, templates = SLOT_MAP[slot]
    post_text = pick_template(templates)

    # Telegramメッセージ
    telegram_msg = f"{icon}【{label}】\n\n{post_text}"

    # Xボタン用URL
    x_intent_url = build_x_intent_url(post_text)

    try:
        notify_telegram(telegram_msg, x_intent_url)
        print(f"[{label}] Telegram送信完了")
    except Exception as e:
        notify_error(f"{label} 送信失敗", e)


if __name__ == "__main__":
    slot = sys.argv[1] if len(sys.argv) > 1 else "morning"
    run(slot)
