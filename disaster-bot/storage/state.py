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
