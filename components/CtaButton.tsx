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
    urgency: '停電は突然起きます。準備していないと対応できません。',
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
    urgency: '災害は突然起きます。準備していないと対応できません。',
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
        margin: '60px 0 0',
        borderRadius: 24,
        border: `3px solid ${color}`,
        overflow: 'hidden',
        boxShadow: `0 12px 40px ${color}28`,
      }}>
        {/* 上帯 */}
        <div style={{ background: color, padding: '16px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 19, color: 'white', fontWeight: 900, margin: 0, letterSpacing: '0.03em' }}>
            迷うならこれでOK ✅
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', margin: '5px 0 0', fontWeight: 600 }}>
            最低限これだけで十分です
          </p>
        </div>

        {/* 本体 */}
        <div style={{
          background: `linear-gradient(160deg, ${color}08, ${color}18)`,
          padding: '28px 22px 26px',
          textAlign: 'center',
        }}>
          {/* 緊急性 */}
          <div style={{
            display: 'inline-block',
            background: '#FEF2F2', border: '1.5px solid #FECACA',
            borderRadius: 12, padding: '10px 18px',
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 14, color: '#DC2626', fontWeight: 800, margin: 0 }}>
              ⚠️ {urgency}
            </p>
          </div>

          <p style={{ fontSize: 12, color: '#64748B', marginBottom: 28 }}>
            {sub}
          </p>

          <a href={link} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            background: color, color: 'white',
            padding: '22px 40px', borderRadius: 50,
            textDecoration: 'none', fontWeight: 900,
            fontSize: 'clamp(17px, 4.5vw, 21px)',
            boxShadow: `0 10px 32px ${color}60`,
            maxWidth: 500, margin: '0 auto',
            letterSpacing: '0.02em',
          }}>
            <span style={{ fontSize: 24 }}>{icon}</span>
            {label} →
          </a>

          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 18 }}>
            ※ Amazon・楽天市場の商品ページへ移動します
          </p>
        </div>
      </div>
    )
  }

  // mid variant
  return (
    <div style={{
      margin: '48px 0',
      borderRadius: 20,
      border: `2.5px solid ${color}`,
      overflow: 'hidden',
      boxShadow: `0 6px 24px ${color}22`,
    }}>
      {/* 上帯 */}
      <div style={{ background: color, padding: '12px 18px', textAlign: 'center' }}>
        <p style={{ fontSize: 16, color: 'white', fontWeight: 900, margin: 0 }}>
          迷うならこれでOK ✅
        </p>
      </div>

      {/* 本体 */}
      <div style={{
        background: `linear-gradient(160deg, ${color}08, ${color}14)`,
        padding: '20px 18px 18px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 13, color: '#334155', marginBottom: 20, fontWeight: 700 }}>
          ⚠️ {urgency}
        </p>
        <a href={link} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: color, color: 'white',
          padding: '20px 32px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 900,
          fontSize: 'clamp(15px, 4vw, 18px)',
          boxShadow: `0 8px 26px ${color}50`,
          maxWidth: 460, margin: '0 auto',
          letterSpacing: '0.02em',
        }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          {label} →
        </a>
      </div>
    </div>
  )
}
