export type ArticleCategory =
  | 'earthquake'
  | 'blackout'
  | 'evacuation'
  | 'disaster-prep'
  | 'typhoon'

export type MainCategory = 'earthquake' | 'typhoon' | 'blackout' | 'evacuation'

export const CATEGORY_MAP: Record<
  ArticleCategory,
  { label: string; emoji: string; description: string }
> = {
  earthquake: {
    label: '地震が起きたとき',
    emoji: '🏚️',
    description: '地震発生の瞬間から今すぐやること。家の中・外・夜の状況別行動。',
  },
  typhoon: {
    label: '台風が来る前',
    emoji: '🌀',
    description: '台風上陸前日・当日の備え。窓・停電・避難の準備リスト。',
  },
  blackout: {
    label: '停電したとき',
    emoji: '🔦',
    description: '停電直後にやること。スマホ・冷蔵庫・長期停電の対処法。',
  },
  evacuation: {
    label: '避難が必要なとき',
    emoji: '🏃',
    description: '避難指示が出たら今すぐやること。避難所での行動・持ち物。',
  },
  'disaster-prep': {
    label: '備蓄・準備',
    emoji: '🎒',
    description: '防災グッズ・食料備蓄・薬の備え・医師目線の防災準備',
  },
}

// トップページに表示するメインの4カテゴリ（表示順）
export const MAIN_CATEGORIES: MainCategory[] = [
  'earthquake',
  'typhoon',
  'blackout',
  'evacuation',
]

// カテゴリごとの「今すぐやること3つ」
export const CATEGORY_URGENT_ACTIONS: Record<MainCategory, { icon: string; text: string }[]> = {
  earthquake: [
    { icon: '🪑', text: '頭を守り、低い姿勢でテーブルの下へ' },
    { icon: '🚪', text: '揺れが収まったらドアを開けて逃げ道を確保' },
    { icon: '🔥', text: 'ガスを止め、火のそばから離れる' },
  ],
  typhoon: [
    { icon: '📦', text: '外にある物を全て屋内に入れる' },
    { icon: '💧', text: '飲料水・食料を3日分確保する' },
    { icon: '📱', text: 'スマホを充電し、避難経路を確認する' },
  ],
  blackout: [
    { icon: '🔦', text: '懐中電灯を取り出し、安全な場所へ移動' },
    { icon: '❄️', text: '冷蔵庫・冷凍庫のドアを開けない' },
    { icon: '📱', text: 'スマホの充電を節約モードにする' },
  ],
  evacuation: [
    { icon: '🎒', text: '非常持ち出し袋を持って今すぐ避難' },
    { icon: '🔌', text: 'ガス・電気・水道を止めてから出る' },
    { icon: '🗺️', text: '避難場所を確認し、安全なルートで移動' },
  ],
}
