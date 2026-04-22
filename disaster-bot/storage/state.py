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
