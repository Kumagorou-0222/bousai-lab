const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? 'bousailab-22'
const RAKUTEN_AFF = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? '103_-1_10000619'

export function amazonUrl(query: string) {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`
}
export function rakutenUrl(query: string) {
  return `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(query)}/?f=1&RankingId=3&grp=product&scid=af_pc_etc&sc2id=af_${RAKUTEN_AFF}`
}

export type CompareProduct = {
  slug: string
  name: string
  emoji: string
  tagline: string                    // 1行説明
  selectionGuide: string[]           // 選び方のポイント
  columns: string[]                  // 比較表ヘッダー
  rows: {
    label: string
    cols: string[]
    recommended?: boolean
    amazonQuery?: string
    rakutenQuery?: string
  }[]
  tableNote: string
  relatedSlugs: string[]
  relatedLabels: Record<string, string>
}

export const COMPARE_DATA: Record<string, CompareProduct> = {
  'mobile-battery': {
    slug: 'mobile-battery',
    name: 'モバイルバッテリー',
    emoji: '🔋',
    tagline: '停電時のスマホ充電に必須。容量・充電速度・重さのバランスで選ぶ。',
    selectionGuide: [
      '容量は20,000mAh以上が防災の基準（スマホ5〜6回分）',
      '急速充電（PD 18W以上）対応なら停電時の短時間充電に有利',
      '重さ500g以下なら避難リュックに入れても負担が少ない',
      'ソーラー充電機能はオマケ程度。AC充電メインで選ぶこと',
    ],
    columns: ['容量', '重さ', '充電速度', '価格目安', '防災向き度'],
    rows: [
      {
        label: '10,000mAh（コンパクト型）',
        cols: ['10,000mAh', '約200g', 'PD 18W', '2,000〜3,500円', '△'],
        amazonQuery: 'モバイルバッテリー 10000mAh PD 軽量',
        rakutenQuery: 'モバイルバッテリー 10000mAh コンパクト',
      },
      {
        label: '20,000mAh（防災スタンダード）',
        cols: ['20,000mAh', '約420g', 'PD 22W', '3,000〜6,000円', '◎'],
        recommended: true,
        amazonQuery: 'モバイルバッテリー 20000mAh PD 防災',
        rakutenQuery: 'モバイルバッテリー 20000mAh 大容量 急速充電',
      },
      {
        label: '30,000mAh（大容量型）',
        cols: ['30,000mAh', '約600g', 'PD 30W', '5,000〜9,000円', '○'],
        amazonQuery: 'モバイルバッテリー 30000mAh 急速充電',
        rakutenQuery: 'モバイルバッテリー 30000mAh 大容量',
      },
      {
        label: 'ポータブル電源（長期停電向け）',
        cols: ['500〜1,000Wh', '約5〜10kg', 'AC 200W〜', '30,000〜80,000円', '◎（長期）'],
        amazonQuery: 'ポータブル電源 500Wh 防災 家庭用',
        rakutenQuery: 'ポータブル電源 500Wh 大容量 防災',
      },
    ],
    tableNote: '◎＝防災用として特におすすめ。容量20,000mAhが価格・性能・重さのバランスが最も良い。',
    relatedSlugs: ['mobile-battery', 'blackout-smartphone', 'portable-power-station'],
    relatedLabels: {
      'mobile-battery':          'モバイルバッテリーの選び方',
      'blackout-smartphone':     '停電時のスマホ節電術',
      'portable-power-station':  'ポータブル電源が必要な人とは',
    },
  },

  'portable-toilet': {
    slug: 'portable-toilet',
    name: '携帯トイレ',
    emoji: '🚽',
    tagline: '断水・停電でマンションのトイレが使えなくなる前に揃えておく。最低50回分/人が目安。',
    selectionGuide: [
      '1人1日7〜10回×7日分＝50〜70回分が最低ライン',
      '凝固剤タイプが主流。吸収体タイプは処理が楽',
      '防臭袋（BOS袋など）と組み合わせて臭い漏れを防ぐ',
      '既存の洋式トイレに被せるタイプが使い勝手が良い',
    ],
    columns: ['タイプ', '回数/パック', '防臭性', '価格目安（1回あたり）', '用途'],
    rows: [
      {
        label: '簡易袋型（最安・最軽量）',
        cols: ['袋＋凝固剤', '1回/袋', '△', '約50〜80円/回', '避難時・短期'],
        amazonQuery: '携帯トイレ 防災 簡易 袋型',
        rakutenQuery: '携帯トイレ 防災 袋タイプ',
      },
      {
        label: '便座シート付き（洋式トイレ用）',
        cols: ['洋式カバー型', '50回分入り', '◯', '約40〜60円/回', '自宅避難'],
        recommended: true,
        amazonQuery: '携帯トイレ 洋式 50回分 防災 凝固剤',
        rakutenQuery: '携帯トイレ 50回分 洋式トイレ用',
      },
      {
        label: '高吸収ポリマー型（処理が楽）',
        cols: ['吸収体タイプ', '30〜100回分', '◎', '約60〜100円/回', '在宅避難'],
        amazonQuery: '携帯トイレ 高吸収 防災 まとめ買い',
        rakutenQuery: '携帯トイレ 高分子吸収体 防災',
      },
      {
        label: '防臭袋（BOS）セット',
        cols: ['消臭袋', '別売り', '◎', '約20〜30円/枚', '臭い対策必須'],
        recommended: false,
        amazonQuery: 'BOS 防臭袋 防災 携帯トイレ用',
        rakutenQuery: 'BOS 防臭袋 Sサイズ 防災',
      },
    ],
    tableNote: '最低限の防臭性を確保するため、携帯トイレと防臭袋を必ずセットで購入すること。',
    relatedSlugs: ['earthquake-toilet', 'emergency-toilet', 'disaster-prep-toilet-count'],
    relatedLabels: {
      'earthquake-toilet':           '地震後のトイレ対策',
      'emergency-toilet':            '在宅避難のトイレ準備',
      'disaster-prep-toilet-count':  '携帯トイレは何個必要？',
    },
  },

  lantern: {
    slug: 'lantern',
    name: 'LEDランタン',
    emoji: '🔦',
    tagline: '停電時の照明は「広く照らせるランタン」が家族全員を守る。懐中電灯との使い分けがポイント。',
    selectionGuide: [
      '明るさは200lm以上が1部屋を照らす最低ライン',
      '乾電池式（単3）がコンビニで入手しやすく防災に向く',
      'USB充電式は普段使いに便利、停電時は充電切れに注意',
      '折りたたみ・吊り下げ式なら避難所・テント内でも使える',
    ],
    columns: ['電源', '明るさ', '連続点灯時間', '価格目安', '防災向き度'],
    rows: [
      {
        label: '乾電池式（単3×3〜4本）',
        cols: ['乾電池（単3）', '300〜500lm', '20〜40時間', '1,500〜4,000円', '◎'],
        recommended: true,
        amazonQuery: 'LEDランタン 乾電池 単3 防災 200lm',
        rakutenQuery: 'LEDランタン 乾電池 防災 明るい',
      },
      {
        label: 'USB充電式',
        cols: ['USB（内蔵電池）', '200〜800lm', '8〜20時間', '2,000〜6,000円', '○'],
        amazonQuery: 'LEDランタン USB充電式 防災 キャンプ',
        rakutenQuery: 'LEDランタン USB充電 防災',
      },
      {
        label: 'ソーラー＋USB充電式',
        cols: ['ソーラー/USB', '100〜300lm', '10〜24時間', '2,500〜5,000円', '△'],
        amazonQuery: 'LEDランタン ソーラー USB充電 防災',
        rakutenQuery: 'LEDランタン ソーラー充電 防災',
      },
      {
        label: 'キャンドル型（雰囲気重視）',
        cols: ['電池/USB', '10〜30lm', '長時間', '1,000〜3,000円', '△'],
        amazonQuery: 'LEDキャンドルランタン 防災',
        rakutenQuery: 'LEDキャンドルランタン 防災',
      },
    ],
    tableNote: '防災の基本は乾電池式。USBやソーラーは補助として持つと安心。',
    relatedSlugs: ['lantern', 'blackout-what-to-do', 'blackout-night'],
    relatedLabels: {
      'lantern':            'ランタンの選び方・使い方',
      'blackout-what-to-do': '停電直後にやること',
      'blackout-night':     '夜の停電対処法',
    },
  },
}
