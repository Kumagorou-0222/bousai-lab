
import random

# 災害キーワードと関連記事スラッグのマッピング
DISASTER_ARTICLE_MAP = {
    "地震": ["earthquake-72h", "earthquake-bath", "earthquake-elevator", "earthquake-furniture", "earthquake-toilet"],
    "震度": ["earthquake-72h", "earthquake-bath", "earthquake-elevator", "earthquake-furniture", "earthquake-toilet"],
    "緊急地震速報": ["earthquake-72h", "earthquake-dangerous", "earthquake-elevator"],
    "津波": ["evacuation-items", "disaster-backpack", "evacuation-health-checklist"],
    "大雨": ["evacuation-items", "disaster-backpack", "flood-prep"],
    "特別警報": ["evacuation-items", "disaster-backpack", "earthquake-72h"],
    "氾濫": ["evacuation-items", "flood-prep"],
    "洪水": ["evacuation-items", "flood-prep"],
    "土砂": ["evacuation-items", "disaster-backpack"],
    "台風": ["disaster-backpack", "blackout-smartphone", "blackout-refrigerator"],
    "暴風": ["disaster-backpack", "blackout-smartphone"],
    "停電": ["blackout-smartphone", "blackout-refrigerator", "blackout-toilet", "blackout-water"],
    "火山": ["evacuation-items", "disaster-backpack"],
    "噴火": ["evacuation-items", "disaster-backpack"],
}

SITE_BASE_URL = "https://bousai-lab.vercel.app"

def get_related_article_url(text: str) -> str:
    """テキスト内容から関連記事のURLを1つ返す"""
    candidates = []
    for kw, slugs in DISASTER_ARTICLE_MAP.items():
        if kw in text:
            candidates.extend(slugs)
    
    if not candidates:
        # デフォルトは避難カテゴリ
        return f"{SITE_BASE_URL}/category/evacuation"
    
    # 重複を排除してランダムに1つ選択
    selected_slug = random.choice(list(set(candidates)))
    return f"{SITE_BASE_URL}/articles/{selected_slug}"

def build_emergency_post_with_article(original_post: str, related_url: str) -> str:
    """既存の投稿文に関連記事URLを付与する"""
    # すでにURLが含まれている場合は、関連記事URLを追記する形にするか検討
    # 現状の generate_x_post は SITE_URL (固定の避難カテゴリ) を含んでいる場合が多い
    
    if SITE_BASE_URL in original_post:
        # 固定URLを関連記事URLに置換
        # generators/post_text.py で SITE_URL が使われている箇所を特定して置換
        from config import SITE_URL as DEFAULT_SITE_URL
        if DEFAULT_SITE_URL in original_post:
            return original_post.replace(DEFAULT_SITE_URL, related_url)
    
    # URLが含まれていない場合は末尾に追加
    return f"{original_post}\n関連記事👇\n{related_url}"
