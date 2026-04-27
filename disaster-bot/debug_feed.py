"""
デバッグ用スクリプト
- JMAフィードの内容を確認
- フィルター判定を表示
- Telegram送信テスト（--test-telegram オプション）

使い方:
  python debug_feed.py              # フィード内容とフィルター判定を表示
  python debug_feed.py --test-telegram  # Telegramにテストメッセージ送信
  python debug_feed.py --reset-db       # seen_entries.db をリセット
"""

import sys
from fetchers.jma_feed import fetch_all_entries
from filters.important import is_notify_entry
from storage.state import init_db, has_seen, mark_seen
from notifiers.telegram_notify import notify_telegram
import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "seen_entries.db")


def show_feed():
    entries = fetch_all_entries()
    print(f"\n=== JMAフィード取得: {len(entries)}件 ===\n")

    for i, entry in enumerate(entries[:20]):  # 最新20件
        entry_id = getattr(entry, "id", "") or getattr(entry, "link", "")
        title    = getattr(entry, "title", "")
        summary  = getattr(entry, "summary", "")

        if not summary and hasattr(entry, "content") and entry.content:
            summary = entry.content[0].get("value", "")

        content = ""
        if hasattr(entry, "content") and entry.content:
            content = entry.content[0].get("value", "")
        full_text = f"{summary} {content}".strip() if content else summary

        seen     = has_seen(entry_id)
        notify   = is_notify_entry(title, full_text)

        print(f"[{i+1:02d}] {'★通知対象★' if notify else '　　　　　'} {'(既読)' if seen else '(未読)'}")
        print(f"     タイトル: {title}")
        print(f"     概要    : {summary[:80]}..." if len(summary) > 80 else f"     概要    : {summary}")
        if content:
            print(f"     content : {content[:100]}..." if len(content) > 100 else f"     content : {content}")
        print()


def test_telegram():
    print("\n=== Telegramテスト送信 ===")
    notify_telegram(
        "🧪 [テスト] disaster-bot の接続確認です\n震度4以上の地震が検知された場合、このように通知されます。",
        x_intent_url=""
    )


def test_keywords():
    from filters.important import get_level
    cases = [
        ("震源・震度に関する情報", "北海道で最大震度５強を観測しました"),
        ("震源・震度に関する情報", "北海道で最大震度５強を観測しました"),  # 全角
        ("震度速報", "震度６弱　北海道"),
        ("震度速報", "震度６弱　北海道"),  # 全角
        ("緊急地震速報（警報）", "強い揺れに警戒してください"),
        ("大雨情報", "明日は晴れ"),  # レベル0
    ]
    print("\n=== キーワードマッチングテスト ===\n")
    for title, text in cases:
        level = get_level(title, text)
        mark = "✅" if level > 0 else "❌"
        print(f"{mark} level={level}  [{title}] {text[:40]}")


def reset_db():
    print("\n=== seen_entries.db をリセット ===")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("DELETE FROM seen")
    deleted = cur.rowcount
    conn.commit()
    conn.close()
    print(f"  {deleted}件の既読レコードを削除しました")
    print("  次回実行時に全エントリが再チェックされます")


if __name__ == "__main__":
    init_db()

    if "--reset-db" in sys.argv:
        reset_db()
    elif "--test-telegram" in sys.argv:
        test_telegram()
    elif "--test-keywords" in sys.argv:
        test_keywords()
    else:
        show_feed()

    if "--test-telegram" not in sys.argv and "--reset-db" not in sys.argv and "--test-keywords" not in sys.argv:
        print("\n--- オプション ---")
        print("  python debug_feed.py --test-telegram  # Telegramにテスト送信")
        print("  python debug_feed.py --reset-db       # seen_entries.db をリセット")
        print("  python debug_feed.py --test-keywords  # キーワードマッチングのテスト")
