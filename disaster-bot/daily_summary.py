"""
daily_summary.py — 1日の災害情報まとめをTelegramに送信する

GitHub Actions のcronで毎日21時(JST)に実行:
  - cron: "0 12 * * *"  # UTC 12:00 = JST 21:00
"""

from storage.state import init_db, get_recent_notified_titles
from notifiers.telegram_notify import notify_telegram
from notifiers.error_notify import notify_error
from datetime import date

LEVEL_LABEL = {3: "🚨", 2: "⚠️", 1: "ℹ️"}


def build_summary_message(rows: list) -> str:
    today = date.today().strftime("%Y年%-m月%-d日")

    if not rows:
        return f"📋【本日の災害まとめ】{today}\n\n本日の重要な災害情報はありませんでした。"

    lines = [f"📋【本日の災害まとめ】{today}\n"]
    for title, level, notified_at in rows:
        icon = LEVEL_LABEL.get(level, "•")
        time_part = notified_at[11:16] if notified_at else ""  # HH:MM
        lines.append(f"{icon} {time_part} {title}")

    lines.append(f"\n計 {len(rows)} 件")
    return "\n".join(lines)


def main() -> None:
    init_db()
    try:
        rows = get_recent_notified_titles(hours=24)
        msg = build_summary_message(rows)
        notify_telegram(msg)
        print(f"[定時まとめ] {len(rows)}件を送信しました")
    except Exception as e:
        notify_error("定時まとめ送信失敗", e)


if __name__ == "__main__":
    main()
