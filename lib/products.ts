import { amazonProductUrl, rakutenRoomUrl } from './affiliateLinks'

export type ComparisonRow = {
  cols: string[]
  recommended?: boolean
}

/**
 * URLフィールドの設定方法:
 * - amazonUrl: amazonProductUrl('商品キーワード') でAmazon商品ページへ解決する
 * - rakutenUrl: rakutenRoomUrl('商品キーワード') で楽天ROOMの商品ページへ解決する
 * - undefined にすると「準備中」表示になり、リンクは出力されない
 */
export type ProductData = {
  mangaSlug: string
  name: string
  emoji: string
  immediateActions: string[]
  ngActions: string[]
  comparison: {
    headers: string[]
    rows: ComparisonRow[]
    note?: string
  }
  featured: {
    name: string
    description: string
    price: string
    badge: string
    trustText: string
    painText: string
    amazonUrl?: string
    rakutenUrl?: string
  }
  alternatives?: {
    name: string
    description: string
    price: string
    badge: string
    amazonUrl?: string
    rakutenUrl?: string
  }[]
}

export const PRODUCTS: ProductData[] = [
  {
    mangaSlug: 'product-portable-toilet',
    name: '携帯トイレ',
    emoji: '🚽',
    immediateActions: [
      '今日中に携帯トイレを何個持っているか数える',
      '50回分（1人最低ライン）× 家族人数分を目標にストック',
      '防臭袋（BOSなど）を一緒に準備する',
      'トイレの近くか防災リュックの中に保管する',
    ],
    ngActions: [
      '断水しても普通にトイレを流そうとする（下水が詰まる）',
      '携帯トイレを買わずに「なんとかなる」と思う',
      '1回分ずつしか持っていない（1人7日分=最低50回分必要）',
    ],
    comparison: {
      headers: ['回数', '対象', '1日目安', '備考'],
      rows: [
        { cols: ['50回分', '1人用', '約7日分', '最低ライン'] },
        { cols: ['100回分', '2人家庭', '各7日分', 'おすすめ'], recommended: true },
        { cols: ['200回分', '4人家族', '各7日分', '防臭袋必須'] },
        { cols: ['防臭袋', '全員', '捨てる際に必須', 'BOS推奨'] },
      ],
      note: '下水道が使えない期間は平均3〜7日。マンションは特にトイレ問題が深刻。',
    },
    featured: {
      name: '携帯トイレ 100回分セット',
      description: '家族2人で7日分をカバー。凝固剤・袋・防臭処理セット。',
      price: '〜5,000円前後',
      badge: '✅ 迷ったらこれ — 2人家庭の最低ライン',
      trustText: '断水時に最も困るのがトイレ問題（医師監修）',
      painText: '携帯トイレなしで断水7日間は、想像以上に過酷です',
      amazonUrl: amazonProductUrl('携帯トイレ 防災 100回分'),
      rakutenUrl: rakutenRoomUrl('携帯トイレ 防災 100回分'),
    },
    alternatives: [
      {
        name: '防臭袋 BOS（LL・200枚）',
        description: '携帯トイレの使用後に必須。三層構造でにおいゼロ。',
        price: '〜2,500円前後',
        badge: 'セットで準備',
        amazonUrl: amazonProductUrl('BOS 防臭袋 防災 携帯トイレ用'),
        rakutenUrl: rakutenRoomUrl('BOS 防臭袋 LL 200枚'),
      },
    ],
  },
  {
    mangaSlug: 'product-mobile-battery',
    name: 'モバイルバッテリー',
    emoji: '🔋',
    immediateActions: [
      '今のモバイルバッテリーの容量を確認する（20,000mAh以上が目標）',
      '今すぐ満充電にする（普段からこれだけで十分）',
      '家族分（最低2台）揃える',
      '防災リュックに1台入れておく',
    ],
    ngActions: [
      '安すぎるバッテリーを選ぶ（過熱・爆発リスクあり）',
      '普段充電せずにいる（いざというとき残量0）',
      '10,000mAh以下で満足する（スマホ2〜3回しか充電できない）',
    ],
    comparison: {
      headers: ['容量', '充電回数', '対象', '価格目安'],
      rows: [
        { cols: ['10,000mAh', 'スマホ約2回', '最低限', '2,000円〜'] },
        { cols: ['20,000mAh', 'スマホ約5回', '推奨', '3,500円〜'], recommended: true },
        { cols: ['2台持ち', '合計10回分', '長期停電', '7,000円〜'] },
        { cols: ['ポータブル電源', '100回以上', '家族・在宅避難', '30,000円〜'] },
      ],
      note: '停電が3日以上続いた場合、スマホへの充電は最低10回分必要。',
    },
    featured: {
      name: 'モバイルバッテリー 20,000mAh',
      description: 'スマホを約5回充電できる。PSE認証済みで安全性高。普段使いも兼用可。',
      price: '3,500〜6,000円前後',
      badge: '✅ 迷ったらこれ — 防災の基本の1台',
      trustText: '停電時の情報収集・家族連絡に必須（医師監修）',
      painText: '「充電切れで家族と連絡できなかった」は実際に起きています',
      amazonUrl: amazonProductUrl('モバイルバッテリー 20000mAh PSE'),
      rakutenUrl: rakutenRoomUrl('モバイルバッテリー 20000mAh 防災'),
    },
    alternatives: [
      {
        name: 'ポータブル電源 1000Wh以上',
        description: '長期停電・家族向け。家電・医療機器も動かせる最終手段。',
        price: '30,000〜100,000円',
        badge: '在宅避難・長期向け',
        amazonUrl: amazonProductUrl('ポータブル電源 1000Wh'),
        rakutenUrl: rakutenRoomUrl('ポータブル電源 1000Wh'),
      },
    ],
  },
  {
    mangaSlug: 'product-led-lantern',
    name: 'LEDランタン',
    emoji: '🏮',
    immediateActions: [
      '今すぐ家にランタンがあるか確認する',
      '乾電池式のランタンを1台以上準備する',
      '予備の乾電池（単3または単4）を多めにストック',
      '寝室とリビングの2か所に置く',
    ],
    ngActions: [
      'ロウソクを使う（火災の危険・一酸化炭素リスク）',
      'スマホのライトだけで乗り切ろうとする（電池が激減する）',
      '充電式のみに頼る（長期停電では充電できなくなる）',
    ],
    comparison: {
      headers: ['明るさ', '用途', '電源', '選ぶ基準'],
      rows: [
        { cols: ['100lm', '手元・枕元', '乾電池/充電', '最低1台'] },
        { cols: ['200lm以上', '部屋全体', '乾電池式推奨', 'メインに'], recommended: true },
        { cols: ['乾電池式', '長期停電向け', '単3/単4', '防災の基本'] },
        { cols: ['充電式', '日常兼用', 'USB充電', 'サブに'] },
      ],
      note: '長期停電では充電できなくなるため、乾電池式が防災では最優先。',
    },
    featured: {
      name: 'LEDランタン（乾電池式・200lm以上）',
      description: '部屋全体を明るく照らせる200lm以上。単3電池×3本で20時間以上点灯。',
      price: '2,000〜5,000円前後',
      badge: '✅ 迷ったらこれ — 乾電池式200lm以上',
      trustText: '夜の停電で部屋全体を照らせるのはランタンだけ（医師監修）',
      painText: 'ロウソクは火災リスク大。スマホライトは電池を急速消耗します',
      amazonUrl: amazonProductUrl('LEDランタン 乾電池式 防災 200lm'),
      rakutenUrl: rakutenRoomUrl('LEDランタン 乾電池 防災'),
    },
  },
  {
    mangaSlug: 'product-water-storage',
    name: '保存水・水の備蓄',
    emoji: '💧',
    immediateActions: [
      '今日、2Lのペットボトルを何本持っているか数える',
      '1人21本（7日分）×家族人数分を目標に設定する',
      '2Lペットボトルを定期的に買い足す（ローリングストック）',
      '飲料水以外に「生活用水」も考える（風呂に水を溜めておく）',
    ],
    ngActions: [
      '水道水だけで十分と思う（断水は突然始まる）',
      '賞味期限切れの水を放置する',
      '全部まとめて買って一度で終わりにする（ローリングが重要）',
    ],
    comparison: {
      headers: ['人数', '7日分', '2Lボトル本数', '置き場所'],
      rows: [
        { cols: ['1人', '21L', '約11本', '押し入れ1段分'] },
        { cols: ['2人', '42L', '約21本', '押し入れ2段分'], recommended: true },
        { cols: ['4人家族', '84L', '約42本', '押し入れ2〜3段'] },
        { cols: ['生活用水も', '別途必要', '風呂に溜める', 'ポリタンク推奨'] },
      ],
      note: '飲料水のほかに、トイレ・手洗い用の生活用水も別途確保が必要。',
    },
    featured: {
      name: '長期保存水 2L×6本×4ケース',
      description: '5〜10年保存可能な専用備蓄水。2人家族の約5日分をカバー。',
      price: '3,000〜5,000円前後',
      badge: '✅ 迷ったらこれ — 2人家庭の5日分セット',
      trustText: '断水は地震後3〜7日続くことが多い（医師監修）',
      painText: 'ペットボトルの水は断水直後にスーパーから消えます',
      amazonUrl: amazonProductUrl('備蓄水 2L 長期保存 防災'),
      rakutenUrl: rakutenRoomUrl('保存水 2L 防災 長期'),
    },
  },
  {
    mangaSlug: 'product-cassette-stove',
    name: 'カセットコンロ・ガス缶',
    emoji: '🔥',
    immediateActions: [
      'カセットコンロが家にあるか確認する',
      'カセットガス缶の本数を数える（12本以上を目標）',
      'ガス缶の期限を確認して古いものは入れ替える',
      '調理の練習として停電を想定した食事を一度作ってみる',
    ],
    ngActions: [
      '室内でカセットコンロを長時間使用する（換気必須）',
      'ガス缶を高温の場所に保管する（爆発リスク）',
      'ガス缶を3本以下しかストックしない',
    ],
    comparison: {
      headers: ['ガス缶本数', '使用目安', '対象', '備考'],
      rows: [
        { cols: ['3本', '約3〜5日分', '最低ライン', '危険ライン'] },
        { cols: ['12本', '約2週間分', '1〜2人向け', '推奨'], recommended: true },
        { cols: ['24本', '約1ヶ月分', '家族向け', '余裕をもって'] },
        { cols: ['換気必須', '—', '必ず窓を開ける', 'CO中毒防止'] },
      ],
      note: '地震後のガス復旧には平均2週間かかる。ガス缶12本以上が安心ライン。',
    },
    featured: {
      name: 'カセットコンロ + ガス缶12本セット',
      description: '定番コンロ1台+ガス缶12本。約2週間の調理をカバー。',
      price: '4,000〜8,000円前後',
      badge: '✅ 迷ったらこれ — コンロ+缶12本セット',
      trustText: 'ガスの復旧は平均2週間。カセットコンロは必須備品（医師監修）',
      painText: '「ガスが止まって2週間、温かいものが食べられなかった」は実話です',
      amazonUrl: amazonProductUrl('カセットコンロ ガス缶 防災 セット'),
      rakutenUrl: rakutenRoomUrl('カセットコンロ 防災 ガス缶'),
    },
  },
  {
    mangaSlug: 'product-portable-power',
    name: 'ポータブル電源',
    emoji: '⚡',
    immediateActions: [
      '自分の家で長期停電時に必要な電力を書き出す',
      '医療機器（CPAP・酸素・透析）がある家庭は最優先で1000Wh以上を準備',
      'まず1000Wh以上の製品をカタログで見る（価格感を把握する）',
      'ソーラーパネルとセット購入を検討する（長期停電対策）',
    ],
    ngActions: [
      '容量300Wh以下を選ぶ（2〜3日でほぼ使い切る）',
      '安すぎる無名品を買う（火災・爆発リスクあり）',
      'ポータブル電源だけ買ってソーラーパネルを省略する',
    ],
    comparison: {
      headers: ['容量', '使用目安', '対象', '価格目安'],
      rows: [
        { cols: ['300Wh', 'スマホ×30回程度', '一人・短期', '20,000円〜'] },
        { cols: ['500Wh', '1〜2日の停電', '2人・短中期', '30,000円〜'] },
        { cols: ['1000Wh以上', '家族・医療機器対応', '在宅避難向け', '60,000円〜'], recommended: true },
        { cols: ['ソーラー併用', '半永久充電', '長期停電対策', '+20,000円〜'] },
      ],
      note: '在宅避難を想定するなら1000Wh以上が必須。医療機器がある家庭は最優先で準備。',
    },
    featured: {
      name: 'ポータブル電源 1000Wh以上',
      description: 'スマホ・扇風機・小型家電を数日稼働可能。医療機器にも対応。',
      price: '60,000〜100,000円前後',
      badge: '✅ 迷ったらこれ — 在宅避難の最終手段',
      trustText: '医療機器を持つ家庭・長期停電対策に1000Wh以上が必要（医師監修）',
      painText: 'CPAP・酸素濃縮器が止まったら命に関わります',
      amazonUrl: amazonProductUrl('ポータブル電源 1000Wh 防災'),
      rakutenUrl: rakutenRoomUrl('ポータブル電源 1000Wh'),
    },
    alternatives: [
      {
        name: 'ソーラーパネル（ポータブル電源対応）',
        description: '太陽光で充電できれば長期停電でも電力が確保できる。',
        price: '20,000〜40,000円前後',
        badge: 'セット購入推奨',
        amazonUrl: amazonProductUrl('ソーラーパネル ポータブル電源 防災'),
        rakutenUrl: rakutenRoomUrl('ソーラーパネル ポータブル電源 防災'),
      },
    ],
  },
  {
    mangaSlug: 'product-preserved-food',
    name: '保存食・非常食',
    emoji: '🍱',
    immediateActions: [
      '今日、家にある食料の7日分換算を計算する',
      'アルファ米・レトルト食品・缶詰を組み合わせて7日分揃える',
      'ローリングストックを始める（賞味期限が近いものから食べて補充）',
      '熱や水が不要な食品も一部混ぜる（カップ麺・乾パン等）',
    ],
    ngActions: [
      '「食料は3日分でOK」と思う（水の復旧まで7日かかる場合も）',
      '同じものばかり揃える（食べ飽きると体と心に影響）',
      '調理が必要なものだけ用意してカセットコンロを省略する',
    ],
    comparison: {
      headers: ['種類', '保存期間', '調理', '特徴'],
      rows: [
        { cols: ['アルファ米', '5〜25年', 'お湯または水', '味が良い・軽い'] },
        { cols: ['レトルト食品', '1〜3年', '温めるだけ', 'バリエーション豊富'], recommended: true },
        { cols: ['缶詰', '3〜5年', 'そのまま食べられる', '栄養バランスGood'] },
        { cols: ['乾パン・ビスケット', '3〜5年', '不要', 'すぐ食べられる'] },
      ],
      note: 'ローリングストックで賞味期限切れを防ぐ。1週間に一度、在庫確認を習慣に。',
    },
    featured: {
      name: '非常食セット 7日分（2人用）',
      description: 'アルファ米・レトルト・缶詰を組み合わせた2人用7日分セット。',
      price: '8,000〜15,000円前後',
      badge: '✅ 迷ったらこれ — 2人用7日分セット',
      trustText: '食料備蓄は「3日分」では不足。7日分が現在の推奨（医師監修）',
      painText: '災害後のスーパーの棚は数時間で空になります',
      amazonUrl: amazonProductUrl('非常食 7日分 2人 セット'),
      rakutenUrl: rakutenRoomUrl('非常食 セット 7日分'),
    },
  },
  {
    mangaSlug: 'product-cooler-box',
    name: 'クーラーボックス・保冷剤',
    emoji: '🧊',
    immediateActions: [
      '冷凍庫に保冷剤を常備しているか確認する（なければ今すぐ購入）',
      'クーラーボックスの有無を確認する（アウトドア用でOK）',
      '停電後2時間以内にクーラーボックスへ移す習慣を覚える',
      'インスリン等の薬がある家庭は専用の薬保冷ケースも準備',
    ],
    ngActions: [
      '停電後2時間以上放置してから移そうとする（食品が傷む）',
      '保冷剤なしで使用する（冷えない）',
      '大きすぎるクーラーボックスを選ぶ（保冷効率が下がる）',
    ],
    comparison: {
      headers: ['サイズ', '用途', '保冷時間', '備考'],
      rows: [
        { cols: ['10〜20L', '1〜2人分', '12〜24時間', '薬・食品'] },
        { cols: ['30〜40L', '家族向け', '24〜48時間', 'おすすめ'], recommended: true },
        { cols: ['保冷剤1kg×4個', '全サイズ共通', '保冷力UP', '必須'] },
        { cols: ['薬専用ケース', 'インスリン等', '2〜8℃維持', '医療用に'] },
      ],
      note: '停電後の冷蔵庫は2時間で食品が危険温度に。タイムリミットを覚えておく。',
    },
    featured: {
      name: 'クーラーボックス 30〜40L + 保冷剤セット',
      description: '家族分の食品と薬を2日間保冷。アウトドア兼用で普段使いも可。',
      price: '5,000〜15,000円前後',
      badge: '✅ 迷ったらこれ — 家族用30〜40L',
      trustText: '夏の停電ではクーラーボックスが食品と薬を守る（医師監修）',
      painText: 'インスリン・薬が無駄になった事例は夏の停電で多発しています',
      amazonUrl: amazonProductUrl('クーラーボックス 30L 防災 保冷剤'),
      rakutenUrl: rakutenRoomUrl('クーラーボックス 保冷剤 防災'),
    },
  },
  {
    mangaSlug: 'product-odor-bag',
    name: '防臭袋（BOS等）',
    emoji: '🛍️',
    immediateActions: [
      '携帯トイレと防臭袋を必ずセットで準備する',
      'BOS等の三層構造の防臭袋を200枚以上ストック',
      '普段のおむつ・生ゴミ処理にも使って慣れておく',
    ],
    ngActions: [
      '普通のポリ袋で代用しようとする（においが漏れる）',
      '携帯トイレだけ買って防臭袋を省略する',
      '1枚ずつしかストックしない',
    ],
    comparison: {
      headers: ['タイプ', '特徴', '用途', '備考'],
      rows: [
        { cols: ['BOS（三層構造）', '業界最高水準の防臭', '携帯トイレ・おむつ', '最推奨'], recommended: true },
        { cols: ['一般防臭袋', '価格安め', '軽い生ゴミ', 'においが漏れる場合も'] },
        { cols: ['Sサイズ', 'おむつ・食品', '小物処理', 'キャンプにも'] },
        { cols: ['LLサイズ', '携帯トイレ専用', '断水時', '主役サイズ'] },
      ],
      note: '携帯トイレの廃棄に使用する場合、LLサイズで二重にするのが基本。',
    },
    featured: {
      name: 'BOS防臭袋 LLサイズ 200枚入',
      description: '三層構造でにおいを完全シャットアウト。携帯トイレの廃棄に最適。',
      price: '2,000〜3,000円前後',
      badge: '✅ 迷ったらこれ — LLサイズ200枚',
      trustText: '防臭袋なしでは携帯トイレの廃棄が困難（医師監修）',
      painText: '普通のゴミ袋では臭いが漏れて避難生活が崩壊します',
      amazonUrl: amazonProductUrl('BOS 防臭袋 LL 200枚'),
      rakutenUrl: rakutenRoomUrl('BOS 防臭袋 LL'),
    },
  },
  {
    mangaSlug: 'product-liquid-milk',
    name: '液体ミルク',
    emoji: '🍼',
    immediateActions: [
      '0〜1歳の赤ちゃんがいる家庭は今すぐ液体ミルクをストック',
      '最低7日分（1日6〜8本程度）×7日分をまとめ買い',
      '哺乳瓶が不要なアタッチメント式も一緒に準備',
      'アレルギー対応品の有無も確認しておく',
    ],
    ngActions: [
      '粉ミルクだけに頼る（断水・停電時はお湯が使えない）',
      '「なんとかなる」と思って備蓄しない',
      '開封後の保存可能時間を把握しない（常温2時間が限度）',
    ],
    comparison: {
      headers: ['タイプ', '特徴', '価格', '備考'],
      rows: [
        { cols: ['液体ミルク（常温）', 'お湯不要・そのまま使用', '150〜200円/本', '防災最優先'], recommended: true },
        { cols: ['粉ミルク', 'コスパ良い', '安価', 'お湯・消毒が必要'] },
        { cols: ['アタッチメント', '哺乳瓶不要', '別途購入', '哺乳瓶消毒が不要に'] },
        { cols: ['アレルギー対応', '大豆・低アレルゲン', '高め', '要事前確認'] },
      ],
      note: '開封後は常温2時間以内に使用。飲み残しは廃棄。液体ミルクは非常時の命綱。',
    },
    featured: {
      name: '液体ミルク（200ml×6本パック）×4セット',
      description: 'お湯不要でそのまま授乳可能。常温保存で賞味期限1〜2年。',
      price: '2,000〜3,500円前後',
      badge: '✅ 迷ったらこれ — 赤ちゃん家庭の必須備蓄',
      trustText: '断水・停電時に粉ミルクは使えない。液体ミルクが命綱（医師監修）',
      painText: 'お湯が使えなくなった瞬間、粉ミルクは赤ちゃんに与えられません',
      amazonUrl: amazonProductUrl('液体ミルク 防災 備蓄 ほほえみ'),
      rakutenUrl: rakutenRoomUrl('液体ミルク 防災 備蓄'),
    },
  },
]

export function getProductByMangaSlug(slug: string): ProductData | undefined {
  return PRODUCTS.find((p) => p.mangaSlug === slug)
}
