// ============================================================
// こどもモード: 難しい言葉をやさしい日本語に変換する辞書
// 対象: 小学校1〜4年生相当
// ============================================================

/**
 * 難しい言葉 → やさしい言葉 への変換辞書
 * 変換後のテキストも FURIGANA_MAP でルビが振られる
 */
export const WORD_SIMPLIFICATIONS: [RegExp, string][] = [
  // 防災専門用語
  [/在宅避難/g, '自分の家での避難'],
  [/ハザードマップ/g, '危険な場所の地図'],
  [/ライフライン/g, '電気・水・ガスなどの生活に必要なもの'],
  [/感染症/g, 'ウイルスや菌による病気'],
  [/断水/g, '水が出なくなること'],
  [/停電/g, '電気が止まること'],
  [/浸水/g, '水があふれること'],
  [/備蓄品/g, '食べ物・水のたくわえ'],
  [/備蓄/g, '食べ物・水のたくわえ'],
  [/慢性疾患/g, '長く続く病気'],
  [/処方箋/g, '薬の指示書'],
  [/処方/g, '薬の指示'],
  [/衛生/g, '清潔さ'],
  [/耐震/g, '地震に強いこと'],
  [/倒壊/g, '建物がたおれること'],
  [/物資/g, '食べ物や道具などの必要なもの'],
  [/被災者/g, '災害にあった人'],
  [/被災/g, '災害にあうこと'],
  [/孤立/g, '一人になること'],
  [/脱出/g, 'にげること'],
]

/**
 * 漢字 → ふりがな の辞書
 * 複合語を先に、単語・短い語を後に記述すること（長い方が優先される）
 */
export const FURIGANA_MAP: [string, string][] = [
  // ===== 防災・避難 =====
  ['防災グッズ', 'ぼうさいグッズ'],
  ['防災用品', 'ぼうさいようひん'],
  ['防災', 'ぼうさい'],
  ['避難指示', 'ひなんしじ'],
  ['避難場所', 'ひなんばしょ'],
  ['避難所', 'ひなんじょ'],
  ['避難袋', 'ひなんぶくろ'],
  ['避難生活', 'ひなんせいかつ'],
  ['避難', 'ひなん'],
  ['在宅', 'ざいたく'],
  ['災害', 'さいがい'],
  ['地震', 'じしん'],
  ['津波', 'つなみ'],
  ['洪水', 'こうずい'],
  ['台風', 'たいふう'],
  ['大雨', 'おおあめ'],
  ['暴風', 'ぼうふう'],
  ['強風', 'きょうふう'],
  ['雷', 'かみなり'],
  ['浸水', 'しんすい'],
  ['土砂崩れ', 'どしゃくずれ'],
  ['土砂', 'どしゃ'],
  ['崩壊', 'ほうかい'],
  ['倒壊', 'とうかい'],
  ['消防署', 'しょうぼうしょ'],
  ['消防', 'しょうぼう'],
  ['警察', 'けいさつ'],
  ['自衛隊', 'じえいたい'],
  // ===== 生活インフラ =====
  ['飲料水', 'いんりょうすい'],
  ['食料品', 'しょくりょうひん'],
  ['食料', 'しょくりょう'],
  ['非常食', 'ひじょうしょく'],
  ['乾電池', 'かんでんち'],
  ['電池', 'でんち'],
  ['懐中電灯', 'かいちゅうでんとう'],
  ['蛍光灯', 'けいこうとう'],
  ['照明', 'しょうめい'],
  ['充電', 'じゅうでん'],
  ['発電機', 'はつでんき'],
  ['太陽光', 'たいようこう'],
  ['電気', 'でんき'],
  ['水道', 'すいどう'],
  ['下水道', 'げすいどう'],
  ['下水', 'げすい'],
  ['排水', 'はいすい'],
  ['携帯電話', 'けいたいでんわ'],
  ['携帯', 'けいたい'],
  // ===== 医療・健康 =====
  ['医師', 'いし'],
  ['医療', 'いりょう'],
  ['病院', 'びょういん'],
  ['救急車', 'きゅうきゅうしゃ'],
  ['救急', 'きゅうきゅう'],
  ['緊急', 'きんきゅう'],
  ['警報', 'けいほう'],
  ['注意報', 'ちゅういほう'],
  ['薬局', 'やっきょく'],
  ['感染', 'かんせん'],
  ['予防', 'よぼう'],
  ['症状', 'しょうじょう'],
  ['熱中症', 'ねっちゅうしょう'],
  ['脱水', 'だっすい'],
  ['体温', 'たいおん'],
  ['消毒液', 'しょうどくえき'],
  ['消毒', 'しょうどく'],
  ['清潔', 'せいけつ'],
  ['衛生', 'えいせい'],
  ['高齢者', 'こうれいしゃ'],
  ['乳幼児', 'にゅうようじ'],
  ['障害者', 'しょうがいしゃ'],
  ['妊婦', 'にんぷ'],
  ['薬', 'くすり'],
  // ===== 建物・場所 =====
  ['高層階', 'こうそうかい'],
  ['高層', 'こうそう'],
  ['階段', 'かいだん'],
  ['建物', 'たてもの'],
  ['施設', 'しせつ'],
  ['体育館', 'たいいくかん'],
  ['公民館', 'こうみんかん'],
  ['市役所', 'しやくしょ'],
  ['河川敷', 'かせんじき'],
  ['河川', 'かせん'],
  ['地形', 'ちけい'],
  ['地盤', 'じばん'],
  ['区域', 'くいき'],
  ['近隣', 'きんりん'],
  ['住所', 'じゅうしょ'],
  ['地図', 'ちず'],
  ['地域', 'ちいき'],
  // ===== 行動・状態 =====
  ['安全確認', 'あんぜんかくにん'],
  ['安全', 'あんぜん'],
  ['危険', 'きけん'],
  ['準備', 'じゅんび'],
  ['家族', 'かぞく'],
  ['情報収集', 'じょうほうしゅうしゅう'],
  ['情報', 'じょうほう'],
  ['連絡先', 'れんらくさき'],
  ['連絡', 'れんらく'],
  ['支援', 'しえん'],
  ['収容', 'しゅうよう'],
  ['配布', 'はいふ'],
  ['長期', 'ちょうき'],
  ['住民', 'じゅうみん'],
  ['確認', 'かくにん'],
  ['必要', 'ひつよう'],
  ['重要', 'じゅうよう'],
  ['注意', 'ちゅうい'],
  ['判断', 'はんだん'],
  ['対策', 'たいさく'],
  ['発生', 'はっせい'],
  ['被害', 'ひがい'],
  ['集合', 'しゅうごう'],
  ['点検', 'てんけん'],
  ['管理', 'かんり'],
  ['保存', 'ほぞん'],
  ['消費期限', 'しょうひきげん'],
  ['賞味期限', 'しょうみきげん'],
  ['入手', 'にゅうしゅ'],
  ['確保', 'かくほ'],
  ['活用', 'かつよう'],
  ['利用', 'りよう'],
  ['使用', 'しよう'],
  ['保管', 'ほかん'],
  ['補充', 'ほじゅう'],
  // ===== 一般的な語 =====
  ['電話番号', 'でんわばんごう'],
  ['電話', 'でんわ'],
  ['番号', 'ばんごう'],
  ['場合', 'ばあい'],
  ['方法', 'ほうほう'],
  ['状況', 'じょうきょう'],
  ['状態', 'じょうたい'],
  ['理由', 'りゆう'],
  ['内容', 'ないよう'],
  ['説明', 'せつめい'],
  ['解説', 'かいせつ'],
  ['問題', 'もんだい'],
  ['解決', 'かいけつ'],
  ['実際', 'じっさい'],
  ['可能', 'かのう'],
  ['以上', 'いじょう'],
  ['以下', 'いか'],
  ['合計', 'ごうけい'],
  ['最低', 'さいてい'],
  ['最大', 'さいだい'],
  ['最高', 'さいこう'],
  ['最初', 'さいしょ'],
  ['最後', 'さいご'],
  ['全員', 'ぜんいん'],
  ['全部', 'ぜんぶ'],
  ['大切', 'たいせつ'],
  ['大事', 'だいじ'],
  ['簡単', 'かんたん'],
  ['便利', 'べんり'],
  ['活動', 'かつどう'],
  ['行動', 'こうどう'],
  ['生活', 'せいかつ'],
  ['生命', 'せいめい'],
  ['命', 'いのち'],
  ['健康', 'けんこう'],
  ['身体', 'からだ'],
  ['精神', 'せいしん'],
  ['体力', 'たいりょく'],
  ['年齢', 'ねんれい'],
  ['水分', 'すいぶん'],
  ['食事', 'しょくじ'],
  ['睡眠', 'すいみん'],
  ['毛布', 'もうふ'],
  ['衣類', 'いるい'],
  ['着替え', 'きがえ'],
  ['防水', 'ぼうすい'],
  ['耐水', 'たいすい'],
  ['防寒', 'ぼうかん'],
  ['保温', 'ほおん'],
  ['期間', 'きかん'],
  ['日数', 'にっすう'],
  ['時間', 'じかん'],
  ['毎日', 'まいにち'],
  ['週間', 'しゅうかん'],
  ['今後', 'こんご'],
  ['以前', 'いぜん'],
  ['現在', 'げんざい'],
  ['将来', 'しょうらい'],
  ['地方', 'ちほう'],
  ['全国', 'ぜんこく'],
  ['都市', 'とし'],
  ['住宅', 'じゅうたく'],
  ['家庭', 'かてい'],
  ['世帯', 'せたい'],
  ['特別', 'とくべつ'],
  ['一般', 'いっぱん'],
  ['主要', 'しゅよう'],
  ['主に', 'おもに'],
  ['特に', 'とくに'],
  ['実は', 'じつは'],
  ['更に', 'さらに'],
  ['及び', 'および'],
  ['武蔵野市', 'むさしのし'],
  ['東京都', 'とうきょうと'],
]

// ============================================================
// 変換処理
// ============================================================

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'RT', 'RP', 'RUBY',
  'CODE', 'PRE', 'TEXTAREA', 'NOSCRIPT',
])

interface FuriganaMatch {
  start: number
  end: number
  word: string
  reading: string
}

/** テキストノードに furigana を適用する */
function applyFurigana(text: string): string {
  const matches: FuriganaMatch[] = []

  for (const [word, reading] of FURIGANA_MAP) {
    let pos = 0
    while (true) {
      const idx = text.indexOf(word, pos)
      if (idx === -1) break
      matches.push({ start: idx, end: idx + word.length, word, reading })
      pos = idx + 1
    }
  }

  if (matches.length === 0) return escapeHtml(text)

  // 開始位置でソート（同じ開始なら長い方が優先）
  matches.sort((a, b) =>
    a.start !== b.start ? a.start - b.start : b.word.length - a.word.length
  )

  // 重複を除去
  const filtered: FuriganaMatch[] = []
  let lastEnd = 0
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m)
      lastEnd = m.end
    }
  }

  // 出力 HTML を構築
  let result = ''
  let pos = 0
  for (const m of filtered) {
    result += escapeHtml(text.slice(pos, m.start))
    result += `<ruby>${escapeHtml(m.word)}<rt>${m.reading}</rt></ruby>`
    pos = m.end
  }
  result += escapeHtml(text.slice(pos))
  return result
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** テキストノードを変換する */
function processTextNode(textNode: Text): void {
  const original = textNode.textContent || ''
  if (!original.trim()) return

  // 1. 難しい言葉をやさしい言葉に置換
  let text = original
  for (const [pattern, replacement] of WORD_SIMPLIFICATIONS) {
    text = text.replace(pattern, replacement)
  }

  // 2. ルビを振る
  const html = applyFurigana(text)
  const noChange = html === escapeHtml(original) && text === original
  if (noChange) return

  // 3. テキストノードを span + HTML に置換
  const span = document.createElement('span')
  span.innerHTML = html
  textNode.parentNode?.replaceChild(span, textNode)
}

/** ノードを再帰的に処理する */
function processNode(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    processTextNode(node as Text)
    return
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement
    if (SKIP_TAGS.has(el.tagName)) return
    const children = Array.from(node.childNodes)
    for (const child of children) {
      processNode(child)
    }
  }
}

/** こどもモードの変換を適用する */
export function applyKidsMode(container: HTMLElement): void {
  if (container.dataset.kidsProcessed === '1') return
  container.dataset.kidsOriginal = container.innerHTML
  container.dataset.kidsProcessed = '1'
  processNode(container)
}

/** こどもモードの変換を元に戻す */
export function restoreKidsMode(container: HTMLElement): void {
  if (container.dataset.kidsOriginal !== undefined) {
    container.innerHTML = container.dataset.kidsOriginal
    delete container.dataset.kidsOriginal
    delete container.dataset.kidsProcessed
  }
}
