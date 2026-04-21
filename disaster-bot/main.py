"""
disaster-bot / main.py

フロー:
  1. 気象庁XMLフィード（地震・火山 + 定時）を取得
  2. 未処理エントリのみ処理（seen_entries.db で管理）
  3. 通知対象かどうか判定（震度4以上・津波・特別警報など）
  4. 投稿文を自動生成
  5. コンソール & LINE & Discord へ通知（人が確認してX投稿）
  6. AUTO_POST_ENABLED=true かつ 限定条件の場合のみ X自動投稿
"""

from fetchers.jma_feed import fetch_all_entries
from filters.important import is_notify_entry, is_auto_post_entry
from generators.post_text import build_telegram_message, generate_x_post, build_x_intent_url
from notifiers.console import notify_console
from notifiers.discord import notify_discord
from notifiers.telegram_notify import notify_telegram
from posters.x_poster import post_to_x
from storage.state import init_db, has_seen, mark_seen
from config import AUTO_POST_ENABLED


def main() -> None:
    init_db()
    entries = fetch_all_entries()

    notified = 0
    for entry in entries:
        entry_id = getattr(entry, "id", "") or getattr(entry, "link", "")
        title   = getattr(entry, "title",   "")
        summary = getattr(entry, "summary", "")

        # 気象庁Atomフィードはcontentタグに詳細情報（震度など）が入るため、
        # summaryとcontentを結合してフィルター・投稿文生成に使う
        content = ""
        if hasattr(entry, "content") and entry.content:
            content = entry.content[0].get("value", "")
        full_text = f"{summary} {content}".strip() if content else summary

        if not entry_id:
            continue

        # 既処理はスキップ
        if has_seen(entry_id):
            continue

        # 通知対象でなければ記録だけして終わり
        if not is_notify_entry(title, full_text):
            mark_seen(entry_id)
            continue

        # Telegram向け（概要 + X投稿案 + ワンクリック投稿ボタン）
        telegram_msg = build_telegram_message(title, full_text)
        x_post = generate_x_post(title, full_text)
        x_intent_url = build_x_intent_url(x_post)
        notify_telegram(telegram_msg, x_intent_url)

        # Discord / コンソール向けはX投稿文のみ
        notify_discord(x_post, title=title)
        notify_console(telegram_msg)
        notified += 1

        # 完全自動投稿（限定条件のみ・現在は無効）
        if AUTO_POST_ENABLED and is_auto_post_entry(title, summary):
            post_to_x(x_post)
        else:
            print("[X投稿] Telegramのコピペ文を確認してXへ手動投稿してください")

        mark_seen(entry_id)

    if notified == 0:
        print("[INFO] 新しい重要情報はありません")
    else:
        print(f"[INFO] {notified}件の情報を通知しました")


if __name__ == "__main__":
    main()
