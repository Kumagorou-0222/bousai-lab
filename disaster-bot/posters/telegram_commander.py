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

    pending = get_pending_posts()
    if not pending:
        notify_telegram("投稿待ちの防災情報はありません。")
        return

    succeeded = 0
    for post_id, post_text in pending:
        try:
            post_to_x(post_text)
            mark_post_executed(post_id)
            succeeded += 1
        except Exception as e:
            print(f"[X投稿失敗] id={post_id}: {e}")
            notify_telegram(f"⚠️ X投稿に失敗しました（id={post_id}）: {e}")

    if succeeded:
        notify_telegram(f"✅ {succeeded}件の防災情報をXに投稿しました。")
        print(f"[X投稿完了] {succeeded}件")
