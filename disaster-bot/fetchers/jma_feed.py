import feedparser
import requests
import xml.etree.ElementTree as ET
from config import JMA_EQVOL_FEED, JMA_REGULAR_FEED

FETCH_TIMEOUT = 15

# これらのタイトルのエントリはリンク先XMLから実際の最大震度を取得する
_EARTHQUAKE_XML_TITLES = {"震度速報", "震源・震度に関する情報"}

# JMA XML の MaxInt 値 → キーワード文字列
_MAXINT_TO_KEYWORD: dict[str, str] = {
    "4":  "震度4",
    "5-": "震度5弱",
    "5+": "震度5強",
    "6-": "震度6弱",
    "6+": "震度6強",
    "7":  "震度7",
}


def fetch_max_int_keyword(entry) -> str:
    """地震エントリのリンクXMLを取得し、最大震度をキーワード文字列で返す。

    対象外エントリや取得失敗時は空文字を返す（呼び出し元は通常通り処理する）。
    """
    title = getattr(entry, "title", "")
    if title not in _EARTHQUAKE_XML_TITLES:
        return ""

    link = getattr(entry, "link", "")
    if not link or not link.startswith("http"):
        return ""

    try:
        resp = requests.get(link, timeout=FETCH_TIMEOUT)
        resp.raise_for_status()
        root = ET.fromstring(resp.content)
        for elem in root.iter():
            if elem.tag.endswith("MaxInt") and elem.text:
                keyword = _MAXINT_TO_KEYWORD.get(elem.text.strip(), "")
                if keyword:
                    print(f"[JMA XML] {title} → MaxInt={elem.text.strip()} → {keyword}")
                return keyword
    except Exception as e:
        print(f"[JMA XML取得失敗] {link}: {e}")
    return ""


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
