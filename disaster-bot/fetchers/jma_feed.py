import feedparser
from config import JMA_EQVOL_FEED, JMA_REGULAR_FEED


def fetch_eqvol_entries() -> list:
    """地震・火山関連フィードを取得"""
    feed = feedparser.parse(JMA_EQVOL_FEED)
    return feed.entries


def fetch_regular_entries() -> list:
    """警報・特別警報・台風など定時フィードを取得"""
    feed = feedparser.parse(JMA_REGULAR_FEED)
    return feed.entries


def fetch_all_entries() -> list:
    """両フィードをまとめて取得（重複なし）"""
    seen_ids: set[str] = set()
    results = []
    for entry in fetch_eqvol_entries() + fetch_regular_entries():
        eid = getattr(entry, "id", "") or getattr(entry, "link", "")
        if eid and eid not in seen_ids:
            seen_ids.add(eid)
            results.append(entry)
    return results
