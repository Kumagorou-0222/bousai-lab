"""
disaster-bot / main.py

フロー:
  1. 気象庁XMLフィード（地震・火山 + 定時）を取得
  2. 未処理エントリのみ処理（seen_entries.db で管理）
  3. 重要度レベル判定（3=最重大 / 2=重大 / 1=注意 / 0=無視）
  4. 地域フィルター（TARGET_AREAS が設定されている場合のみ）
  5. 投稿文を自動生成
  6. Telegram通知（レベル1以上）+ Xボタン（レベル2以上）
  7. AUTO_POST_ENABLED=true かつレベル3のみ X自動投稿
"""

from datetime import datetime, timedelta

from fetchers.jma_feed import fetch_all_entries
from filters.important import get_level, is_target_area, is_auto_post_entry
from generators.post_text import build_telegram_message, generate_x_post, build_x_intent_url
from notifiers.console import notify_console
from notifiers.discord import notify_discord
from notifiers.telegram_notify import notify_telegram
from notifiers.error_notify import notify_error
from posters.x_poster import post_to_x
from storage.state import (
    init_db, has_seen, mark_seen, log_notify, log_error,
    get_last_notify_time, is_update_entry, get_recent_notified_titles,
)
from config import AUTO_POST_ENABLED

# 同一レベル内での連続投稿を防ぐ最小間隔（秒）
MIN_NOTIFY_INTERVAL_SEC = 60


def _within_rate_limit() -> bool:
    """直近通知から MIN_NOTIFY_INTERVAL_SEC 以内なら False"""
    last = get_last_notify_time()
    if not last:
        return True
    try:
        last_dt = datetime.fromisoformat(last)
        return datetime.now() - last_dt >= timedelta(seconds=MIN_NOTIFY_INTERVAL_SEC)
    except ValueError:
        return True


def main() -> None:
    init_db()
    try:
        entries = fetch_all_entries()
    except RuntimeError as e:
        notify_error("JMAフィード取得失敗", e)
        log_error("fetch", str(e))
        return

    notified = 0
    for entry in entries:
        entry_id = getattr(entry, "id", "") or getattr(entry, "link", "")
        title    = getattr(entry, "title",   "")
        summary  = getattr(entry, "summary", "")

        # summaryとcontentを結合（contentに震度などの詳細が入るため）
        content = ""
        if hasattr(entry, "content") and entry.content:
            content = entry.content[0].get("value", "")
        full_text = f"{summary} {content}".strip() if content else summary

        if not entry_id:
            continue
        if has_seen(entry_id):
            continue

        # 重要度レベル判定
        level = get_level(title, full_text)
        if level == 0:
            mark_seen(entry_id)
            continue

        # 地域フィルター（設定されている場合）
        if not is_target_area(full_text):
            mark_seen(entry_id)
            continue

        # 速度制御（連続スパム防止）
        if not _within_rate_limit():
            print(f"[SKIP] レート制限中: {title}")
            continue

        # 更新報・解除報の検知（D-1）
        update_prefix = ""
        if is_update_entry(title):
            update_prefix = "🔄【更新】" if "更新" in title or "続報" in title else "✅【解除】"

        # 投稿文生成
        x_post       = generate_x_post(title, full_text)
        if update_prefix:
            x_post = f"{update_prefix}\n{x_post}"
        telegram_msg = build_telegram_message(title, full_text, level=level)

        # レベル2以上のみXボタンを付ける
        x_intent_url = build_x_intent_url(x_post) if level >= 2 else ""

        # Telegram通知
        try:
            notify_telegram(telegram_msg, x_intent_url)
        except Exception as e:
            notify_error("Telegram送信失敗", e)
            log_error("telegram", str(e))

        notify_discord(x_post, title=title)
        notify_console(telegram_msg)

        # ログ保存
        log_notify(entry_id, title, level, x_post)
        notified += 1

        # レベル3 + AUTO_POST_ENABLED のみ自動投稿
        if AUTO_POST_ENABLED and level >= 3 and is_auto_post_entry(title, full_text):
            try:
                post_to_x(x_post)
            except Exception as e:
                notify_error("X投稿失敗", e)
                log_error("x_post", str(e))
        else:
            print(f"[X投稿] レベル{level} — Telegramで確認後Xへ手動投稿してください")

        mark_seen(entry_id)

    if notified == 0:
        print("[INFO] 新しい重要情報はありません")
    else:
        print(f"[INFO] {notified}件の情報を通知しました")


if __name__ == "__main__":
    main()
