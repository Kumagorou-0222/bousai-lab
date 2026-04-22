import feedparser
import requests
from config import JMA_EQVOL_FEED, JMA_REGULAR_FEED

FETCH_TIMEOUT = 15


def _parse_feed(url: str) -> list:
    """フィードを取得してエントリを返す。失敗時は例外を raise する。"""
    try:
        resp = requests.get(url, timeout=FETCH_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException as e:
        raise RuntimeError(f"フィード取得失敗: {url}\n{e}") from e
    feed = feedparser.parse(resp.text)
    if feed.bozo and not feed.entries:
        raise RuntimeError(f"フィードパース失敗: {url}\n{feed.bozo_exception}")
    return feed.entries


def fetch_eqvol_entries() -> list:
    return _parse_feed(JMA_EQVOL_FEED)


def fetch_regular_entries() -> list:
    return _parse_feed(JMA_REGULAR_FEED)


def fetch_all_entries() -> list:
    """両フィードをまとめて取得（重複なし）。失敗時は例外を raise する。"""
    seen_ids: set[str] = set()
    results = []
    for entry in fetch_eqvol_entries() + fetch_regular_entries():
        eid = getattr(entry, "id", "") or getattr(entry, "link", "")
        if eid and eid not in seen_ids:
            seen_ids.add(eid)
            results.append(entry)
    return results
