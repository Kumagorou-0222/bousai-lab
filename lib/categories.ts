export type ArticleCategory =
  | 'earthquake'
  | 'blackout'
  | 'evacuation'
  | 'disaster-prep'
  | 'typhoon'
  | 'heavy-rain'
  | 'flood'
  | 'tsunami'
  | 'landslide'
  | 'volcano'
  | 'crime-prevention'

export type MainCategory = 'earthquake' | 'typhoon' | 'blackout' | 'evacuation'

export type ExtendedCategory =
  | 'heavy-rain'
  | 'flood'
  | 'tsunami'
  | 'landslide'
  | 'volcano'

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
  'heavy-rain': {
    label: '豪雨・線状降水帯',
    emoji: '🌧️',
    description: '線状降水帯・大雨警報発令時の行動。冠水・アンダーパス・車中の危険を回避する。',
  },
  flood: {
    label: '浸水・洪水',
    emoji: '🌊',
    description: '浸水何cmで危険か。歩行・車・地下駐車場の避難判断を解説。',
  },
  tsunami: {
    label: '津波',
    emoji: '🌊',
    description: '津波警報が出たら即座に高台へ。津波と津波注意報の違い・行動マニュアル。',
  },
  landslide: {
    label: '土砂災害・がけ崩れ',
    emoji: '⛰️',
    description: '土砂災害警戒情報・崖崩れの前兆を知り、早期避難を判断する。',
  },
  volcano: {
    label: '火山・降灰',
    emoji: '🌋',
    description: '火山灰の危険性と対策。車・停電・水道・マスクの正しい知識。',
  },
  'crime-prevention': {
    label: '防犯',
    emoji: '🔒',
    description: '空き巣・特殊詐欺・子どもの見守りなど、暮らしを守る防犯対策を医師目線で解説。',
  },
}

// トップページに表示するメインの4カテゴリ（表示順）
export const MAIN_CATEGORIES: MainCategory[] = [
  'earthquake',
  'typhoon',
  'blackout',
  'evacuation',
]

// 拡張カテゴリ（Phase1: heavy-rain, flood / Phase2: tsunami, landslide / Phase3: volcano）
export const EXTENDED_CATEGORIES: ExtendedCategory[] = [
  'heavy-rain',
  'flood',
  'tsunami',
  'landslide',
  'volcano',
]

// カテゴリごとの「今すぐやること3つ」
export const CATEGORY_URGENT_ACTIONS: Record<
  MainCategory | ExtendedCategory,
  { icon: string; text: string }[]
> = {
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
  'heavy-rain': [
    { icon: '📻', text: '気象警報・避難情報をすぐに確認する' },
    { icon: '🚫', text: 'アンダーパス・冠水道路には絶対入らない' },
    { icon: '🏠', text: '警戒レベル3以上なら今すぐ高台・上層階へ' },
  ],
  flood: [
    { icon: '⬆️', text: '浸水30cm超えたら徒歩避難をあきらめ上層階へ' },
    { icon: '🚗', text: '車は浸水30cmで走行困難・エンジンを切って逃げる' },
    { icon: '🚫', text: '地下・地下駐車場には絶対に留まらない' },
  ],
  tsunami: [
    { icon: '🏃', text: '揺れを感じたら即座に海から離れ高台へ走る' },
    { icon: '📻', text: '津波警報・注意報を必ず確認する' },
    { icon: '🚫', text: '「様子を見る」は絶対にNG。とにかく逃げる' },
  ],
  landslide: [
    { icon: '📻', text: '土砂災害警戒情報が出たら直ちに避難' },
    { icon: '🚫', text: '崖・川・山の様子を見に行かない' },
    { icon: '🏠', text: '崖に近い部屋は離れ、建物の中心部・上層階へ' },
  ],
  volcano: [
    { icon: '😷', text: '火山灰用マスク（N95）を着用する' },
    { icon: '🚗', text: '車のワイパーを動かさない（ガラスが傷つく）' },
    { icon: '🏠', text: '窓・換気口を閉め、外出を最小限にする' },
  ],
}
