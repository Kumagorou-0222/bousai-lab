export type ArticleCategory =
  | 'earthquake'
  | 'blackout'
  | 'evacuation'
  | 'disaster-prep'

export const CATEGORY_MAP: Record<
  ArticleCategory,
  { label: string; emoji: string; description: string }
> = {
  earthquake: {
    label: '地震対策',
    emoji: '🏚️',
    description: '地震発生時の行動・マンション防災・在宅避難の判断基準を解説',
  },
  blackout: {
    label: '停電対策',
    emoji: '🔦',
    description: '停電時の電源確保・冷蔵庫管理・ポータブル電源活用法',
  },
  evacuation: {
    label: '避難所',
    emoji: '🏫',
    description: '武蔵野市の避難所一覧・避難所での感染症対策・持ち物リスト',
  },
  'disaster-prep': {
    label: '備蓄・準備',
    emoji: '🎒',
    description: '防災グッズ・食料備蓄・薬の備え・医師目線の防災準備',
  },
}
