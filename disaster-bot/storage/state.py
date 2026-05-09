import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "seen_entries.db")


def init_db() -> None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS seen (
            id      TEXT PRIMARY KEY,
            seen_at TEXT DEFAULT (datetime('now', 'localtime'))
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS notify_log (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id   TEXT,
            title      TEXT,
            level      INTEGER,
            post_text  TEXT,
            notified_at TEXT DEFAULT (datetime('now', 'localtime'))
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS error_log (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            context    TEXT,
            message    TEXT,
            logged_at  TEXT DEFAULT (datetime('now', 'localtime'))
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS pending_posts (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            post_text  TEXT NOT NULL,
            executed   INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS meta (
            key   TEXT PRIMARY KEY,
            value TEXT
        )
    """)
    conn.commit()
    conn.close()


def has_seen(entry_id: str) -> bool:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM seen WHERE id = ?", (entry_id,))
    row = cur.fetchone()
    conn.close()
    return row is not None


def mark_seen(entry_id: str) -> None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("INSERT OR IGNORE INTO seen (id) VALUES (?)", (entry_id,))
    conn.commit()
    conn.close()


def log_notify(entry_id: str, title: str, level: int, post_text: str) -> None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO notify_log (entry_id, title, level, post_text) VALUES (?, ?, ?, ?)",
        (entry_id, title, level, post_text),
    )
    conn.commit()
    conn.close()


def log_error(context: str, message: str) -> None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO error_log (context, message) VALUES (?, ?)",
        (context, message),
    )
    conn.commit()
    conn.close()


def get_last_notify_time() -> str | None:
    """直近の通知時刻を返す（投稿速度制御用）"""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT notified_at FROM notify_log ORDER BY id DESC LIMIT 1")
    row = cur.fetchone()
    conn.close()
    return row[0] if row else None


def is_update_entry(title: str) -> bool:
    """更新報・解除報かどうかを判定する"""
    return any(kw in title for kw in ["更新", "解除", "訂正", "続報"])


def get_recent_notified_titles(hours: int = 24) -> list[str]:
    """過去N時間以内に通知したタイトル一覧（D-2定時まとめ用）"""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT title, level, notified_at FROM notify_log "
        "WHERE notified_at >= datetime('now', ?, 'localtime') "
        "ORDER BY id DESC",
        (f"-{hours} hours",),
    )
    rows = cur.fetchall()
    conn.close()
    return rows


# ── pending_posts (Telegram確認→X投稿) ───────────────────────────

def add_pending_post(post_text: str) -> None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("INSERT INTO pending_posts (post_text) VALUES (?)", (post_text,))
    conn.commit()
    conn.close()


def get_pending_posts() -> list[tuple[int, str]]:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT id, post_text FROM pending_posts WHERE executed = 0 ORDER BY id")
    rows = cur.fetchall()
    conn.close()
    return rows


def mark_post_executed(post_id: int) -> None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("UPDATE pending_posts SET executed = 1 WHERE id = ?", (post_id,))
    conn.commit()
    conn.close()


# ── meta (getUpdates オフセット管理) ─────────────────────────────

def get_last_update_id() -> int | None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT value FROM meta WHERE key = 'last_update_id'")
    row = cur.fetchone()
    conn.close()
    return int(row[0]) if row else None


def set_last_update_id(update_id: int) -> None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT OR REPLACE INTO meta (key, value) VALUES ('last_update_id', ?)",
        (str(update_id),),
    )
    conn.commit()
    conn.close()
