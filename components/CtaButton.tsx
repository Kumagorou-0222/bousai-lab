import type { ArticleCategory } from '@/lib/categories'

const CATEGORY_CTA: Record<ArticleCategory, { text: string; subText: string; emoji: string; color: string; href: string }> = {
  earthquake: {
    text: '今すぐ備える — これだけ揃えればOK',
    subText: '防災リュック・ヘルメット・家具固定の3点',
    emoji: '🏚️', color: '#DC2626',
    href: '/earthquake-items',
  },
  typhoon: {
    text: '今すぐ備える — これだけ揃えればOK',
    subText: '保存水・非常食・養生テープの3点',
    emoji: '🌀', color: '#2563EB',
    href: '/typhoon-items',
  },
  blackout: {
    text: '今すぐ備える — これだけ揃えればOK',
    subText: 'モバイルバッテリー・ランタン・ポータブル電源',
    emoji: '🔦', color: '#D97706',
    href: '/blackout-items',
  },
  evacuation: {
    text: '今すぐ備える — 避難グッズを確認',
    subText: '非常持ち出し袋・携帯トイレ・保険証コピー',
    emoji: '🏃', color: '#16A34A',
    href: '/earthquake-items',
  },
  'disaster-prep': {
    text: '最低限これだけ揃えればOK',
    subText: '防災グッズ・備蓄・薬の準備',
    emoji: '🎒', color: '#475569',
    href: '/earthquake-items',
  },
}

export default function CtaButton({
  text,
  subText,
  href,
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
  const link = href ?? defaults.href

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
        <p style={{ fontSize: 12, color: '#64748B', marginBottom: 4, fontWeight: 700 }}>
          ⚠️ 災害はいつ来るかわかりません
        </p>
        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 18 }}>
          {sub}
        </p>
        <a href={link} style={{
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
      <a href={link} style={{
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
