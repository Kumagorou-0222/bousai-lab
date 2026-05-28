/**
 * X投稿ハッシュタグ自動生成
 *
 * 優先順序：
 *  1. #防災（常時）
 *  2. スラッグ個別オーバーライド（Sランク等）
 *  3. カテゴリタグ（1〜2個）
 *  4. シリーズタグ（xSeries: 保存版 など）
 *  5. スロットタグ（朝/昼/夜）
 *  6. 地域タグ（武蔵野市記事のみ）
 *
 * 最大 5 個・重複なし
 */

export type HashtagSlot = 'morning' | 'noon' | 'night'

// =====================================================
// スロット別ラベル（投稿文冒頭に付与）
// =====================================================

export const SLOT_LABELS: Record<HashtagSlot, string> = {
  morning: '今日の備え',
  noon:    '1分防災',
  night:   '家族で確認',
}

// =====================================================
// カテゴリ別タグ（優先度順）
// =====================================================

const CATEGORY_TAGS: Record<string, string[]> = {
  earthquake:      ['#地震', '#地震対策'],
  blackout:        ['#停電', '#停電対策'],
  evacuation:      ['#避難所', '#在宅避難'],
  'disaster-prep': ['#備蓄', '#防災グッズ'],
  typhoon:         ['#台風', '#台風対策'],
  medical:         ['#災害医療', '#感染症対策'],
}

// =====================================================
// スラッグ個別オーバーライド（Sランク記事など）
// =====================================================

const SLUG_OVERRIDES: Record<string, string[]> = {
  'earthquake-elevator':   ['#地震', '#エレベーター'],
  'blackout-refrigerator': ['#停電', '#冷蔵庫'],
  'earthquake-toilet':     ['#地震', '#断水'],
  'blackout-smartphone':   ['#停電', '#モバイルバッテリー'],
  'evacuation-illness':    ['#避難所', '#感染症対策'],
  'musashino':             ['#武蔵野市', '#東京防災'],
}

// =====================================================
// スロット別タグ
// =====================================================

const SLOT_TAGS: Record<HashtagSlot, string> = {
  morning: '#今日の備え',
  noon:    '#1分防災',
  night:   '#家族で確認',
}

// =====================================================
// xSeries別タグ
// =====================================================

const SERIES_TAGS: Record<string, string> = {
  '保存版':      '#保存版',
  'これだけでOK': '#備蓄',
  '1分防災':     '#1分防災',
  '家族で確認':   '#家族で確認',
}

// =====================================================
// メイン生成関数
// =====================================================

const MAX_TAGS = 5

export function generateHashtags(params: {
  slug: string
  category: string
  slot: HashtagSlot
  xSeries?: string
  hasRegion?: boolean
}): string[] {
  const tags: string[] = []
  const seen = new Set<string>()

  function add(tag: string): boolean {
    if (seen.has(tag) || tags.length >= MAX_TAGS) return false
    seen.add(tag)
    tags.push(tag)
    return true
  }

  // 1. #防災（必須）
  add('#防災')

  // 2. スラッグオーバーライド
  const overrides = SLUG_OVERRIDES[params.slug]
  if (overrides) {
    for (const t of overrides) add(t)
  } else {
    // 3. カテゴリタグ（オーバーライドがない場合）
    const catTags = CATEGORY_TAGS[params.category] ?? []
    for (const t of catTags) add(t)
  }

  // 4. シリーズタグ（xSeries）
  if (params.xSeries) {
    const seriesTag = SERIES_TAGS[params.xSeries]
    if (seriesTag) add(seriesTag)
  }

  // 5. スロットタグ
  add(SLOT_TAGS[params.slot])

  // 6. 地域タグ（スラッグオーバーライドに含まれていない場合）
  if (params.hasRegion && !overrides) {
    add('#武蔵野市')
  }

  return tags
}

// =====================================================
// 投稿文のハッシュタグ除去
// 末尾の「#タグ」をすべて除去して返す
// =====================================================

export function stripTrailingHashtags(text: string): string {
  return text.replace(/(\s+#[^\s#]+)+\s*$/, '').trimEnd()
}

// =====================================================
// 投稿文にハッシュタグを付与
// =====================================================

export function applyHashtags(text: string, hashtags: string[]): string {
  const base = stripTrailingHashtags(text)
  if (hashtags.length === 0) return base
  return `${base}\n\n${hashtags.join(' ')}`
}

// =====================================================
// スロットラベルを投稿文冒頭に付与
// 既存の【...】があれば置換、なければ先頭に追加
// xSeries === '保存版' のみ独自ラベルを優先
// =====================================================

export function applySlotLabel(
  text: string,
  slot: HashtagSlot,
  xSeries?: string,
): string {
  const label = xSeries === '保存版' ? '保存版' : SLOT_LABELS[slot]
  if (/^【[^】]*】/.test(text)) {
    return text.replace(/^【[^】]*】/, `【${label}】`)
  }
  return `【${label}】${text}`
}
