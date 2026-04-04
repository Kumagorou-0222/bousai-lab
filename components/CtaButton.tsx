import type { ArticleCategory } from '@/lib/categories'

const CATEGORY_CTA: Record<ArticleCategory, { text: string; subText: string; emoji: string; color: string }> = {
  earthquake: {
    text: '今すぐ備える — 地震対策グッズを確認',
    subText: '家具固定・防災リュック・非常食',
    emoji: '🏚️', color: '#DC2626',
  },
  typhoon: {
    text: '今すぐ備える — 台風対策グッズを確認',
    subText: '養生テープ・保存水・懐中電灯',
    emoji: '🌀', color: '#2563EB',
  },
  blackout: {
    text: '今すぐ備える — 停電対策グッズを確認',
    subText: '懐中電灯・モバイルバッテリー・カセットコンロ',
    emoji: '🔦', color: '#D97706',
  },
  evacuation: {
    text: '今すぐ備える — 避難グッズを確認',
    subText: '非常持ち出し袋・携帯トイレ・保険証コピー',
    emoji: '🏃', color: '#16A34A',
  },
  'disaster-prep': {
    text: 'チェックリストを確認する',
    subText: '防災グッズ・備蓄・薬の準備',
    emoji: '🎒', color: '#475569',
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
        background: '#F8FAFC',
        borderRadius: 16,
        border: `1.5px solid ${color}`,
        padding: '24px 20px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 6, fontWeight: 600 }}>
          ⚠️ 災害はいつ来るかわかりません
        </p>
        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 18 }}>
          {sub}
        </p>
        <a href={href} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: color, color: 'white',
          padding: '14px 28px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 800,
          fontSize: 'clamp(13px, 3.8vw, 16px)',
          boxShadow: `0 4px 18px ${color}44`,
          width: '100%', maxWidth: 420, boxSizing: 'border-box',
        }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          {label}
        </a>
      </div>
    )
  }

  // mid variant
  return (
    <div style={{
      margin: '36px 0',
      background: '#F8FAFC',
      borderRadius: 14,
      border: `1.5px solid ${color}88`,
      padding: '18px 16px',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14, fontWeight: 600 }}>
        ⚠️ 今のうちに準備しておきましょう
      </p>
      <a href={href} style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: color, color: 'white',
        padding: '13px 24px', borderRadius: 50,
        textDecoration: 'none', fontWeight: 800,
        fontSize: 'clamp(13px, 3.8vw, 15px)',
        boxShadow: `0 4px 14px ${color}44`,
        width: '100%', maxWidth: 380, boxSizing: 'border-box',
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        {label}
      </a>
    </div>
  )
}
