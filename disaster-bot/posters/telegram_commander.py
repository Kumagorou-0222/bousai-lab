"""
Telegram の getUpdates をポーリングして「投稿」返信を検知し、
pending_posts を X に投稿する。

disaster-check.yml が5分ごとに main.py を呼び出す際、
main() の冒頭で check_and_execute_commands() を実行することで機能する。
"""

import requests
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
from storage.state import (
    get_last_update_id, set_last_update_id,
    get_pending_posts, mark_post_executed,
)
from posters.x_poster import post_to_x
from posters.emergency_window import emergency_x_hours
from fetchers.jma_feed import fetch_all_entries
from filters.important import get_level, is_target_area
from notifiers.telegram_notify import notify_telegram

# これらの返信でXへの投稿が実行される
TRIGGER_WORDS = {"投稿", "ok", "OK", "post", "Post", "投稿する"}


def check_and_execute_commands() -> None:
    """Telegram未読メッセージを確認し、TRIGGER_WORDSがあればpending_postsをXへ投稿する。"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return

    offset = get_last_update_id()
    params: dict = {"timeout": 0, "allowed_updates": ["message"]}
    if offset is not None:
        params["offset"] = offset + 1

    try:
        resp = requests.get(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates",
            params=params,
            timeout=10,
        )
        resp.raise_for_status()
        updates = resp.json().get("result", [])
    except Exception as e:
        print(f"[getUpdates失敗] {e}")
        return

    if not updates:
        return

    # オフセットを進める（既読扱いにする）
    set_last_update_id(updates[-1]["update_id"])

    triggered = any(
        update.get("message", {}).get("text", "").strip() in TRIGGER_WORDS
        for update in updates
    )
    if not triggered:
        return

    if not emergency_x_hours():
        notify_telegram("緊急X投稿の受付時間外です。最新情報を確認してください。")
        return

    pending = get_pending_posts()
    if not pending:
        notify_telegram("投稿待ちの防災情報はありません。")
        return

    succeeded = 0
    try:
        current_entries = fetch_all_entries()
    except Exception as e:
        print(f"[最新警報の再確認失敗] {e}")
        return
    current_ids = set()
    for entry in current_entries:
        entry_id = getattr(entry, "id", "") or getattr(entry, "link", "")
        title = getattr(entry, "title", "")
        summary = getattr(entry, "summary", "")
        if entry_id and get_level(title, summary) >= 2 and is_target_area(summary):
            current_ids.add(entry_id)

    for post_id, post_text, entry_id in pending:
        if entry_id not in current_ids:
            mark_post_executed(post_id)
            print(f"[X投稿見送り] 最新フィードに有効情報がありません: id={post_id}")
            continue
        try:
            post_to_x(post_text, emergency=True)
            mark_post_executed(post_id)
            succeeded += 1
        except Exception as e:
            print(f"[X投稿失敗] id={post_id}: {e}")
            notify_telegram(f"⚠️ X投稿に失敗しました（id={post_id}）: {e}")

    if succeeded:
        notify_telegram(f"✅ {succeeded}件の防災情報をXに投稿しました。")
        print(f"[X投稿完了] {succeeded}件")
