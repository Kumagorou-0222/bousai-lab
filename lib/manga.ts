export type MangaPanel = {
  character: 'riss' | 'robot'
  text: string
}

export type MangaData = {
  slug: string
  title: string
  category: string
  emoji: string
  description: string
  panels: MangaPanel[]
  points: string[]
  articleSlug: string
  date: string
  mangaImages?: string[]
}

export const MANGA_LIST: MangaData[] = [
  {
    slug: 'earthquake-elevator',
    title: '地震のとき、エレベーターは使っていい？',
    category: 'earthquake',
    emoji: '🏢',
    description: '地震直後のエレベーター使用の危険性をリスとロボが教えてくれます',
    panels: [
      { character: 'riss', text: 'じしんがきた！エレベーターで逃げよう！' },
      { character: 'robot', text: '待て！エレベーターはだめだ！' },
      { character: 'robot', text: '停電で閉じ込め…余震で急停止…危険がいっぱい' },
      { character: 'riss', text: 'わかった！階段を使うんだね！覚えた！' },
    ],
    points: [
      '地震直後はエレベーターを使わない',
      '停電・閉じ込めのリスクがある',
      '震度5強以上は点検完了まで使用禁止',
    ],
    articleSlug: 'earthquake-elevator',
    date: '2026-04-01',
    mangaImages: [
      '/manga/earthquake-elevator/panel-01.png',
      '/manga/earthquake-elevator/panel-02.png',
      '/manga/earthquake-elevator/panel-03.png',
      '/manga/earthquake-elevator/panel-04.png',
    ],
  },
  {
    slug: 'blackout-basics',
    title: '停電したとき、まずなにをする？',
    category: 'blackout',
    emoji: '🔦',
    description: '停電直後にやるべき3つの行動をリスとロボが教えてくれます',
    panels: [
      { character: 'riss', text: '停電した！どうすればいいの？！' },
      { character: 'robot', text: 'まず落ち着け。3つだけやることがある' },
      { character: 'robot', text: '①懐中電灯 ②スマホ充電確認 ③ブレーカー確認' },
      { character: 'riss', text: '3つだけ覚えればいいんだね！' },
    ],
    points: [
      'まず懐中電灯を確保する',
      'スマホの残量を確認して節約モードに',
      'ブレーカーが落ちていないか確認する',
    ],
    articleSlug: 'blackout-what-to-do',
    date: '2026-04-01',
    mangaImages: [
      '/manga/blackout-basics/panel-01.png',
      '/manga/blackout-basics/panel-02.png',
      '/manga/blackout-basics/panel-03.png',
      '/manga/blackout-basics/panel-04.png',
    ],
  },
  {
    slug: 'evacuation-basics',
    title: '避難所ってどんなところ？何を持っていく？',
    category: 'evacuation',
    emoji: '🏃',
    description: '避難所の基本と持ち物をリスとロボがやさしく解説します',
    panels: [
      { character: 'riss', text: 'ひなんじょって、こわそう…何を持っていけばいいの？' },
      { character: 'robot', text: '怖くない。準備さえすれば大丈夫だ' },
      { character: 'robot', text: '水・食料3日分・薬・貴重品・充電器が最優先' },
      { character: 'riss', text: 'リュックに入れておけばいいんだね！準備しよう！' },
    ],
    points: [
      '避難所は「一時的な安全場所」だと理解する',
      '持ち物は「水・食料・薬・貴重品・充電器」が最優先',
      '避難所より在宅避難の方が安全な場合もある',
    ],
    articleSlug: 'evacuation-shelter-infection',
    date: '2026-04-01',
    mangaImages: [
      '/manga/evacuation-basics/panel-01.png',
      '/manga/evacuation-basics/panel-02.png',
      '/manga/evacuation-basics/panel-03.png',
      '/manga/evacuation-basics/panel-04.png',
    ],
  },
]

export function getMangaBySlug(slug: string): MangaData {
  const manga = MANGA_LIST.find((m) => m.slug === slug)
  if (!manga) throw new Error(`Manga not found: ${slug}`)
  return manga
}

export const CATEGORY_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  earthquake: { bg: '#FEF2F2', accent: '#DC2626', text: '#7F1D1D' },
  blackout:   { bg: '#FFFBEB', accent: '#D97706', text: '#78350F' },
  evacuation: { bg: '#F0FDF4', accent: '#16A34A', text: '#14532D' },
}
