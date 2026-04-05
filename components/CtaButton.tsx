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
        margin: '56px 0 0',
        borderRadius: 22,
        border: `2.5px solid ${color}`,
        overflow: 'hidden',
        boxShadow: `0 8px 32px ${color}22`,
      }}>
        {/* 上帯：「迷うならこれでOK」 */}
        <div style={{
          background: color,
          padding: '14px 20px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 18, color: 'white', fontWeight: 900, margin: 0, letterSpacing: '0.03em' }}>
            迷うならこれでOK ✅
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: '4px 0 0', fontWeight: 600 }}>
            最低限これだけで十分です
          </p>
        </div>

        {/* 本体 */}
        <div style={{
          background: `linear-gradient(135deg, ${color}0A, ${color}16)`,
          padding: '24px 20px 22px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: '#334155', marginBottom: 6, fontWeight: 700 }}>
            ⚠️ {urgency}
          </p>
          <p style={{ fontSize: 12, color: '#64748B', marginBottom: 24 }}>
            {sub}
          </p>
          <a href={link} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: color, color: 'white',
            padding: '20px 36px', borderRadius: 50,
            textDecoration: 'none', fontWeight: 900,
            fontSize: 'clamp(16px, 4.5vw, 20px)',
            boxShadow: `0 8px 28px ${color}55`,
            maxWidth: 480, margin: '0 auto',
            letterSpacing: '0.02em',
          }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            {label} →
          </a>
          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 16 }}>
            ※ Amazon・楽天市場の商品ページへ移動します
          </p>
        </div>
      </div>
    )
  }

  // mid variant
  return (
    <div style={{
      margin: '44px 0',
      borderRadius: 18,
      border: `2px solid ${color}`,
      overflow: 'hidden',
      boxShadow: `0 4px 20px ${color}22`,
    }}>
      {/* 上帯 */}
      <div style={{
        background: color,
        padding: '10px 18px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 15, color: 'white', fontWeight: 900, margin: 0 }}>
          迷うならこれでOK ✅
        </p>
      </div>

      {/* 本体 */}
      <div style={{
        background: `linear-gradient(135deg, ${color}08, ${color}14)`,
        padding: '18px 18px 16px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 12, color: '#475569', marginBottom: 16, fontWeight: 700 }}>
          ⚠️ {urgency}
        </p>
        <a href={link} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: color, color: 'white',
          padding: '18px 30px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 900,
          fontSize: 'clamp(15px, 4vw, 17px)',
          boxShadow: `0 6px 22px ${color}44`,
          maxWidth: 440, margin: '0 auto',
          letterSpacing: '0.02em',
        }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          {label} →
        </a>
      </div>
    </div>
  )
}
