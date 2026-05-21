"""
scheduled_post_runner.py — 朝・昼・夜の定時投稿案をTelegramに送信

・朝（08:00 JST）: 保存系  → Telegram送信 + X自動投稿
・昼（12:00 JST）: ストーリー系 → Telegram送信のみ
・夜（20:00 JST）: まとめ系  → Telegram送信 + X自動投稿

テンプレートは通し日数 % 本数 で順番に選ぶ（重複なし）
--auto-post フラグを付けると X にも自動投稿する

使い方:
  python scheduled_post_runner.py morning
  python scheduled_post_runner.py noon
  python scheduled_post_runner.py evening
  python scheduled_post_runner.py morning --auto-post
"""

import argparse
from datetime import date

from content.scheduled_templates import MORNING, NOON, EVENING
from generators.post_text import build_x_intent_url
from notifiers.telegram_notify import notify_telegram
from notifiers.error_notify import notify_error
from posters.x_poster import post_to_x

SLOT_MAP = {
    "morning": ("朝の防災メモ", "📌", MORNING),
    "noon":    ("昼の防災ストーリー", "💬", NOON),
    "evening": ("夜の防災まとめ", "🌙", EVENING),
}


def pick_template(templates: list[dict]) -> dict:
    """通し日数 % 本数 で順番に選ぶ（日付が変われば次の投稿文になる）"""
    day_of_year = date.today().timetuple().tm_yday
    index = day_of_year % len(templates)
    return templates[index]


def run(slot: str, auto_post: bool = False) -> None:
    if slot not in SLOT_MAP:
        print(f"[ERROR] 不明なスロット: {slot}  使い方: morning / noon / evening")
        raise SystemExit(1)

    label, icon, templates = SLOT_MAP[slot]
    template = pick_template(templates)
    post_text = template["text"]
    manga_slug = template.get("manga_slug") or ""

    telegram_msg = f"{icon}【{label}】\n\n{post_text}"
    x_intent_url = build_x_intent_url(post_text)

    try:
        notify_telegram(telegram_msg, x_intent_url, manga_slug=manga_slug)
        print(f"[{label}] Telegram送信完了 (manga={manga_slug or 'なし'})")
    except Exception as e:
        notify_error(f"{label} 送信失敗", e)

    if auto_post:
        try:
            post_to_x(post_text)
            print(f"[{label}] X自動投稿完了")
        except Exception as e:
            notify_error(f"{label} X投稿失敗", e)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("slot", nargs="?", default="morning", choices=list(SLOT_MAP))
    parser.add_argument("--auto-post", action="store_true", help="X に自動投稿する")
    args = parser.parse_args()
    run(args.slot, auto_post=args.auto_post)
