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
  // ── 防災を学ぶ ──────────────────────────────────────────
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

  // ── 防災グッズを知る ────────────────────────────────────
  {
    slug: 'product-portable-toilet',
    title: '断水してもトイレは使える！携帯トイレの使い方',
    category: 'goods',
    emoji: '🚽',
    description: '断水時に携帯トイレがなければ大変なことに。リスとロボが使い方を解説します',
    panels: [
      { character: 'riss', text: '断水した！トイレが流せない…！' },
      { character: 'robot', text: '携帯トイレがあれば大丈夫だ' },
      { character: 'robot', text: '袋セット→用を足す→凝固剤→口を縛る' },
      { character: 'riss', text: '50回分ストック済み！これで安心！' },
    ],
    points: [
      '断水時は普通のトイレが使えなくなる',
      '携帯トイレは袋+凝固剤で簡単に使える',
      '50回分以上を事前に準備しておく',
    ],
    articleSlug: 'emergency-toilet',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-portable-toilet/panel-01.png',
      '/manga/product-portable-toilet/panel-02.png',
      '/manga/product-portable-toilet/panel-03.png',
      '/manga/product-portable-toilet/panel-04.png',
    ],
  },
  {
    slug: 'product-mobile-battery',
    title: '充電切れで家族と連絡できなくなる前に',
    category: 'goods',
    emoji: '🔋',
    description: '停電中のスマホ充電問題をモバイルバッテリーで解決。容量の選び方も解説',
    panels: [
      { character: 'riss', text: '充電切れ…家族に連絡できない！' },
      { character: 'robot', text: 'モバイルバッテリーを渡そう' },
      { character: 'robot', text: '20,000mAh=スマホ5回分。常に満充電で保管' },
      { character: 'riss', text: '家族と繋がれた！バッテリーは命綱だ！' },
    ],
    points: [
      '停電時はコンセントが使えなくなる',
      '20,000mAh以上のモバイルバッテリーを選ぶ',
      '普段から満充電を習慣にする',
    ],
    articleSlug: 'mobile-battery',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-mobile-battery/panel-01.png',
      '/manga/product-mobile-battery/panel-02.png',
      '/manga/product-mobile-battery/panel-03.png',
      '/manga/product-mobile-battery/panel-04.png',
    ],
  },
  {
    slug: 'product-led-lantern',
    title: '夜の停電、暗闇の恐怖をLEDランタンで解決',
    category: 'goods',
    emoji: '🏮',
    description: '完全な暗闇でパニックにならないために。家族全員が集まれる明かりを準備しよう',
    panels: [
      { character: 'riss', text: '停電…何も見えない、こわい…' },
      { character: 'robot', text: 'LEDランタンをつけよう！' },
      { character: 'robot', text: '乾電池式・200ルーメン以上・連続20時間以上' },
      { character: 'riss', text: '家族みんなが集まれる！安心だ！' },
    ],
    points: [
      '懐中電灯より部屋全体を照らせるランタンが優秀',
      '乾電池式・200lm以上・20時間以上が選ぶ基準',
      '1台は寝室、1台はリビングに常備する',
    ],
    articleSlug: 'blackout-night',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-led-lantern/panel-01.png',
      '/manga/product-led-lantern/panel-02.png',
      '/manga/product-led-lantern/panel-03.png',
      '/manga/product-led-lantern/panel-04.png',
    ],
  },
  {
    slug: 'product-water-storage',
    title: '断水しても生き延びる！水の備蓄は21L以上',
    category: 'goods',
    emoji: '💧',
    description: '水の備蓄は最も基本的な防災対策。1人7日分21Lの計算方法を解説します',
    panels: [
      { character: 'riss', text: '断水した…水が1滴も出ない' },
      { character: 'robot', text: '備蓄水があれば大丈夫だ' },
      { character: 'robot', text: '1人1日2〜3L × 7日 = 最低21L' },
      { character: 'riss', text: '今日から21本ストック開始！備えあれば憂いなし！' },
    ],
    points: [
      '大災害では断水が数日〜数週間続く',
      '1人1日2〜3L×7日分=21L以上が目標',
      '2Lペットボトルを定期ローリングストック',
    ],
    articleSlug: 'water-storage-necessary',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-water-storage/panel-01.png',
      '/manga/product-water-storage/panel-02.png',
      '/manga/product-water-storage/panel-03.png',
      '/manga/product-water-storage/panel-04.png',
    ],
  },
  {
    slug: 'product-cassette-stove',
    title: 'ガスが止まっても温かい食事を！カセットコンロ',
    category: 'goods',
    emoji: '🔥',
    description: '地震後はガスが止まる。カセットコンロとガス缶12本以上で食事問題を解決',
    panels: [
      { character: 'riss', text: 'ガスが止まった…温かいものが食べられない' },
      { character: 'robot', text: 'カセットコンロがあれば料理できるぞ！' },
      { character: 'robot', text: 'ガス缶12本以上。お湯・ご飯・缶詰を温める' },
      { character: 'riss', text: '温かいご飯がこんなに嬉しいとは！必需品だ！' },
    ],
    points: [
      '地震後はガスが数日〜数週間止まる場合がある',
      'カセットガス缶は12本以上ストックする',
      'カセットコンロで3食分の調理が可能',
    ],
    articleSlug: 'earthquake-cooking',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-cassette-stove/panel-01.png',
      '/manga/product-cassette-stove/panel-02.png',
      '/manga/product-cassette-stove/panel-03.png',
      '/manga/product-cassette-stove/panel-04.png',
    ],
  },
  {
    slug: 'product-portable-power',
    title: '長期停電の最終兵器！ポータブル電源の選び方',
    category: 'goods',
    emoji: '⚡',
    description: '停電3日目でも家電が動く。1000Wh以上のポータブル電源で在宅避難を快適に',
    panels: [
      { character: 'riss', text: '停電3日目…もう限界だ…' },
      { character: 'robot', text: 'ポータブル電源があれば全部動く！' },
      { character: 'robot', text: '1000Wh以上・AC100V対応。スマホ・扇風機・医療機器まで' },
      { character: 'riss', text: 'これ1台で全部解決！高くても絶対買うべき！' },
    ],
    points: [
      '長期停電には1000Wh以上のポータブル電源が有効',
      'AC100V対応なら家電がほぼすべて使える',
      '医療機器(CPAP等)の継続使用にも対応可能',
    ],
    articleSlug: 'blackout-longterm',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-portable-power/panel-01.png',
      '/manga/product-portable-power/panel-02.png',
      '/manga/product-portable-power/panel-03.png',
      '/manga/product-portable-power/panel-04.png',
    ],
  },
  {
    slug: 'product-preserved-food',
    title: 'スーパーが空でも困らない！保存食の備え方',
    category: 'goods',
    emoji: '🍱',
    description: '災害直後は食料が手に入らない。7日分の保存食をローリングストックで準備しよう',
    panels: [
      { character: 'riss', text: 'スーパーに何もない…家族が空腹だ' },
      { character: 'robot', text: '家に7日分の備蓄食がある！' },
      { character: 'robot', text: 'アルファ米・レトルト・缶詰でローリングストック' },
      { character: 'riss', text: '備蓄があれば焦らない！今日から少しずつ揃えよう！' },
    ],
    points: [
      '災害後はスーパーの棚が数時間で空になる',
      'アルファ米・レトルト・缶詰を7日分以上用意',
      'ローリングストックで賞味期限切れを防ぐ',
    ],
    articleSlug: 'disaster-prep-food-days',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-preserved-food/panel-01.png',
      '/manga/product-preserved-food/panel-02.png',
      '/manga/product-preserved-food/panel-03.png',
      '/manga/product-preserved-food/panel-04.png',
    ],
  },
  {
    slug: 'product-cooler-box',
    title: '夏の停電、冷蔵庫の食品を2時間以内に守れ',
    category: 'goods',
    emoji: '🧊',
    description: '真夏の停電は冷蔵庫の食品と薬が危ない。クーラーボックスで2時間以内に移そう',
    panels: [
      { character: 'riss', text: '停電2時間！冷蔵庫の食べ物が腐る！' },
      { character: 'robot', text: '2時間以内なら冷蔵品を移せるぞ！' },
      { character: 'robot', text: '食品・薬をクーラーボックス+保冷剤で保管' },
      { character: 'riss', text: '食料も薬も守った！夏の停電はクーラーボックスが必須！' },
    ],
    points: [
      '停電後2時間が冷蔵品の移動タイムリミット',
      'インスリン等の薬の保管にも使える',
      '保冷剤は冷凍庫に常備しておく',
    ],
    articleSlug: 'blackout-refrigerator',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-cooler-box/panel-01.png',
      '/manga/product-cooler-box/panel-02.png',
      '/manga/product-cooler-box/panel-03.png',
      '/manga/product-cooler-box/panel-04.png',
    ],
  },
  {
    slug: 'product-odor-bag',
    title: '携帯トイレの臭い問題は防臭袋で完全解決',
    category: 'goods',
    emoji: '🛍️',
    description: '携帯トイレを使った後の処理が不安？防臭袋があれば臭いゼロで衛生的に処理できます',
    panels: [
      { character: 'riss', text: '携帯トイレを使ったけど…臭いが心配' },
      { character: 'robot', text: '防臭袋に入れれば完全に臭わないぞ！' },
      { character: 'robot', text: '3層構造でにおいゼロ。可燃ゴミとして捨てられる' },
      { character: 'riss', text: '全然臭わない！これがあれば衛生的に生活できる！' },
    ],
    points: [
      '携帯トイレの廃棄に防臭袋は必須',
      '3層構造の防臭袋は臭いを完全にシャットアウト',
      '可燃ゴミとして処理できるものを選ぶ',
    ],
    articleSlug: 'blackout-toilet',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-odor-bag/panel-01.png',
      '/manga/product-odor-bag/panel-02.png',
      '/manga/product-odor-bag/panel-03.png',
      '/manga/product-odor-bag/panel-04.png',
    ],
  },
  {
    slug: 'product-liquid-milk',
    title: '赤ちゃんがいる家庭に液体ミルクは必須備蓄',
    category: 'goods',
    emoji: '🍼',
    description: '断水・停電時でもお湯不要で使える液体ミルク。赤ちゃんがいる家庭の必須備蓄品',
    panels: [
      { character: 'riss', text: '水がない！哺乳瓶も消毒できない！赤ちゃんが泣いてる！' },
      { character: 'robot', text: '液体ミルクはそのままあげられるぞ！' },
      { character: 'robot', text: 'お湯不要・常温保存・賞味期限1〜2年' },
      { character: 'riss', text: '赤ちゃんがいる家庭の必需品！ストックしておいて本当によかった！' },
    ],
    points: [
      '液体ミルクはお湯も哺乳瓶の消毒も不要',
      '常温保存で賞味期限は1〜2年のものが多い',
      '0〜1歳の赤ちゃんがいる家庭は必ずストック',
    ],
    articleSlug: 'evacuation-items',
    date: '2026-05-09',
    mangaImages: [
      '/manga/product-liquid-milk/panel-01.png',
      '/manga/product-liquid-milk/panel-02.png',
      '/manga/product-liquid-milk/panel-03.png',
      '/manga/product-liquid-milk/panel-04.png',
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
  goods:      { bg: '#FFF7ED', accent: '#EA580C', text: '#7C2D12' },
}
