import type { ArticleCategory } from '@/lib/categories'

const CATEGORY_CTA: Record<ArticleCategory, { text: string; subText: string; urgency: string; emoji: string; color: string; href: string }> = {
  earthquake: {
    text: '今すぐ備える — これだけでOK',
    subText: '防災リュック・ヘルメット・家具固定の3点',
    urgency: '地震はいつ来るかわかりません。準備は「今日」しかない。',
    emoji: '🏚️', color: '#DC2626',
    href: '/earthquake-items',
  },
  typhoon: {
    text: '台風が来る前に準備する',
    subText: '保存水・非常食・養生テープの3点',
    urgency: '台風は来ることがわかっている。準備できるのに、しないのはリスクです。',
    emoji: '🌀', color: '#2563EB',
    href: '/typhoon-items',
  },
  blackout: {
    text: '停電になる前に準備する',
    subText: 'モバイルバッテリー・ランタン・ポータブル電源',
    urgency: '停電してからでは遅い。今ならすぐ揃えられます。',
    emoji: '🔦', color: '#D97706',
    href: '/blackout-items',
  },
  evacuation: {
    text: '今すぐ避難グッズを確認する',
    subText: '非常持ち出し袋・携帯トイレ・保険証コピー',
    urgency: '避難指示が出てから探しても間に合いません。',
    emoji: '🏃', color: '#16A34A',
    href: '/earthquake-items',
  },
  'disaster-prep': {
    text: 'これだけ準備すればOK',
    subText: '防災グッズ・備蓄・薬の準備',
    urgency: '災害はいつ来るかわかりません。今日できることを今日やる。',
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
  const { color, urgency } = defaults
  const link = href ?? defaults.href

  if (variant === 'end') {
    return (
      <div style={{
        margin: '48px 0 0',
        background: `linear-gradient(135deg, ${color}0D, ${color}18)`,
        borderRadius: 20,
        border: `2px solid ${color}`,
        padding: '28px 22px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 13, color: color, marginBottom: 6, fontWeight: 800 }}>
          ⚠️ {urgency}
        </p>
        <p style={{ fontSize: 12, color: '#64748B', marginBottom: 22 }}>
          {sub}
        </p>
        <a href={link} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: color, color: 'white',
          padding: '18px 32px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 900,
          fontSize: 'clamp(15px, 4vw, 18px)',
          boxShadow: `0 6px 24px ${color}55`,
          maxWidth: 460, margin: '0 auto',
        }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          {label} →
        </a>
        <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 14 }}>
          ※ Amazon・楽天市場の商品ページへ移動します
        </p>
      </div>
    )
  }

  // mid variant
  return (
    <div style={{
      margin: '40px 0',
      background: `linear-gradient(135deg, ${color}08, ${color}14)`,
      borderRadius: 16,
      border: `2px solid ${color}99`,
      padding: '22px 18px',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 12, color: color, marginBottom: 18, fontWeight: 800 }}>
        ⚠️ {urgency}
      </p>
      <a href={link} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: color, color: 'white',
        padding: '16px 28px', borderRadius: 50,
        textDecoration: 'none', fontWeight: 900,
        fontSize: 'clamp(14px, 4vw, 16px)',
        boxShadow: `0 5px 20px ${color}44`,
        maxWidth: 420, margin: '0 auto',
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        {label} →
      </a>
    </div>
  )
}
