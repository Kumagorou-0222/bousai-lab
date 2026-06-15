"""
scheduled_post_runner.py — 朝・昼・夜の定時投稿

/x-posts ページと同じ日付シードで選ばれた投稿文を
Vercel API (/api/daily-schedule) から取得して X に投稿する。

使い方:
  python scheduled_post_runner.py morning --auto-post
  python scheduled_post_runner.py noon    --auto-post
  python scheduled_post_runner.py evening --auto-post
"""

import argparse

from fetchers.daily_schedule import fetch_today_post
from notifiers.telegram_notify import notify_telegram
from notifiers.error_notify import notify_error
from posters.x_poster import post_to_x

SLOT_LABELS = {
    "morning": ("朝の防災メモ",     "🌅"),
    "noon":    ("昼の防災",         "☀️"),
    "evening": ("夜の防災まとめ",   "🌙"),
}


def run(slot: str, auto_post: bool = False) -> None:
    if slot not in SLOT_LABELS:
        print(f"[ERROR] 不明なスロット: {slot}  使い方: morning / noon / evening")
        raise SystemExit(1)

    label, icon = SLOT_LABELS[slot]

    try:
        post = fetch_today_post(slot)
    except Exception as e:
        notify_error(f"{label} スケジュール取得失敗", e)
        raise SystemExit(1)

    post_text = post["text"]
    slug      = post.get("slug", "")

    telegram_msg = f"{icon}【{label}】\n\n{post_text}"

    try:
        notify_telegram(telegram_msg, "", manga_slug=slug)
        print(f"[{label}] Telegram送信完了 (slug={slug})")
    except Exception as e:
        notify_error(f"{label} Telegram送信失敗", e)

    if auto_post:
        try:
            post_to_x(post_text)
            print(f"[{label}] X自動投稿完了")
        except Exception as e:
            notify_error(f"{label} X投稿失敗", e)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("slot", nargs="?", default="morning", choices=list(SLOT_LABELS))
    parser.add_argument("--auto-post", action="store_true", help="X に自動投稿する")
    args = parser.parse_args()
    run(args.slot, auto_post=args.auto_post)
