import type { ArticleCategory } from '@/lib/categories'

// カテゴリ別のデフォルトCTA設定
const CATEGORY_CTA: Record<ArticleCategory, { text: string; subText: string; emoji: string; color: string }> = {
  earthquake: {
    text: '今すぐ備える — 地震対策グッズを確認',
    subText: '家具固定・防災リュック・非常食',
    emoji: '🏚️', color: '#FF6B00',
  },
  typhoon: {
    text: '今すぐ備える — 台風対策グッズを確認',
    subText: '養生テープ・保存水・懐中電灯',
    emoji: '🌀', color: '#3A5FFF',
  },
  blackout: {
    text: '今すぐ備える — 停電対策グッズを確認',
    subText: '懐中電灯・モバイルバッテリー・カセットコンロ',
    emoji: '🔦', color: '#E69500',
  },
  evacuation: {
    text: '今すぐ備える — 避難グッズを確認',
    subText: '非常持ち出し袋・携帯トイレ・保険証コピー',
    emoji: '🏃', color: '#1E9E50',
  },
  'disaster-prep': {
    text: 'チェックリストを確認する',
    subText: '防災グッズ・備蓄・薬の準備',
    emoji: '🎒', color: '#FF6B00',
  },
}

export default function CtaButton({
  text,
  subText,
  href = '/articles/disaster-prep-goods',
  emoji,
  category,
  variant = 'mid',
}: {
  text?: string
  subText?: string
  href?: string
  emoji?: string
  category?: ArticleCategory
  /** mid = 記事中盤, end = 記事末尾 */
  variant?: 'mid' | 'end'
}) {
  const defaults = category ? CATEGORY_CTA[category] : CATEGORY_CTA['disaster-prep']
  const label = text ?? defaults.text
  const sub = subText ?? defaults.subText
  const icon = emoji ?? defaults.emoji
  const color = defaults.color

  if (variant === 'end') {
    return (
      <div style={{
        margin: '40px 0 0',
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        borderRadius: 18,
        border: `2px solid ${color}`,
        padding: '24px 20px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 6, fontWeight: 600 }}>
          ⚠️ 災害はいつ来るかわかりません
        </p>
        <p style={{ fontSize: 12, color: '#aaa', marginBottom: 18 }}>
          {sub}
        </p>
        <a href={href} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: color, color: 'white',
          padding: '16px 32px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 900,
          fontSize: 'clamp(14px, 4vw, 17px)',
          boxShadow: `0 6px 24px ${color}55`,
          width: '100%', maxWidth: 420, boxSizing: 'border-box',
        }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          {label}
        </a>
      </div>
    )
  }

  // mid variant
  return (
    <div style={{
      margin: '36px 0',
      background: '#FFFBF4',
      borderRadius: 16,
      border: `2px solid ${color}88`,
      padding: '20px 18px',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 14, fontWeight: 600 }}>
        ⚠️ 今のうちに準備しておきましょう
      </p>
      <a href={href} style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: color, color: 'white',
        padding: '14px 28px', borderRadius: 50,
        textDecoration: 'none', fontWeight: 800,
        fontSize: 'clamp(13px, 3.8vw, 16px)',
        boxShadow: `0 4px 18px ${color}44`,
        width: '100%', maxWidth: 380, boxSizing: 'border-box',
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        {label}
      </a>
    </div>
  )
}
