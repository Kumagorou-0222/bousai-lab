import { amazonProductUrl, rakutenRoomUrl } from '@/lib/affiliateLinks'

type Props = {
  name: string
  price: string
  description: string
  emoji: string
  amazonUrl?: string
  rakutenUrl?: string
  badge?: string
  accent?: string
  trustText?: string
  painText?: string   // 「これがないと〇〇できない」
  featured?: boolean  // 1位強調表示
  /** @deprecated use amazonUrl instead */
  url?: string
}

export default function ProductCard({
  name, price, description, emoji,
  amazonUrl, rakutenUrl, badge, accent = '#2563EB', trustText, painText,
  featured = false,
  url,
}: Props) {
  const resolvedAmazonUrl = amazonUrl || url ? amazonProductUrl(amazonUrl ?? url ?? '') : ''
  const resolvedRakutenUrl = rakutenUrl ? rakutenRoomUrl(rakutenUrl) : ''
  const lightBg = accent === '#DC2626' ? '#FEF2F2'
    : accent === '#D97706' ? '#FFFBEB'
    : accent === '#16A34A' ? '#F0FDF4'
    : accent === '#0EA5E9' ? '#F0F9FF'
    : '#EFF6FF'

  if (featured) {
    // ── 1位：フィーチャー表示 ──────────────────────────────
    return (
      <div style={{
        borderRadius: 22,
        border: `3px solid ${accent}`,
        marginBottom: 16,
        boxShadow: `0 10px 36px ${accent}33`,
        overflow: 'hidden',
      }}>
        {/* 上帯ラベル */}
        <div style={{
          background: accent,
          padding: '10px 18px',
          textAlign: 'center',
        }}>
          <span style={{
            color: 'white', fontSize: 15, fontWeight: 900, letterSpacing: '0.04em',
          }}>
            {badge ?? '✅ 迷ったらこれ — これを買えば大丈夫'}
          </span>
        </div>

        <div style={{
          background: lightBg,
          padding: '22px 20px 18px',
        }}>
          {/* アイコン＋テキスト */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
            <div style={{
              width: 76, height: 76,
              background: 'white',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38, flexShrink: 0,
              boxShadow: `0 4px 14px ${accent}22`,
            }}>
              {emoji}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 900, fontSize: 17, color: '#0F172A', lineHeight: 1.4, marginBottom: 5 }}>
                {name}
              </div>
              <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.75, marginBottom: 6 }}>
                {description}
              </div>
              <div style={{ fontSize: 19, color: accent, fontWeight: 900 }}>
                {price}
              </div>
            </div>
          </div>

        {/* 不安訴求 */}
        {painText && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 10,
            padding: '8px 14px',
            marginBottom: 12,
            fontSize: 13, color: '#DC2626', fontWeight: 700,
          }}>
            ⚠️ {painText}
          </div>
        )}

        {/* 信頼性バッジ */}
        {trustText && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: '#F0FDF4', border: '1px solid #86EFAC',
            borderRadius: 20, padding: '4px 14px', marginBottom: 14,
            fontSize: 12, color: '#15803D', fontWeight: 700,
          }}>
            ✅ {trustText}
          </div>
        )}

          {/* ボタン */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {resolvedAmazonUrl && (
              <a href={resolvedAmazonUrl} target="_blank" rel="noopener noreferrer sponsored"
                style={{
                  flex: '1 1 140px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#FF9900', color: '#111',
                  fontSize: 15, fontWeight: 900,
                  borderRadius: 12, padding: '16px 18px',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(255,153,0,0.5)',
                }}
              >
                🛒 Amazonで見る
              </a>
            )}
            {resolvedRakutenUrl && (
              <a href={resolvedRakutenUrl} target="_blank" rel="noopener noreferrer sponsored"
                style={{
                  flex: '1 1 140px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#BF0000', color: 'white',
                  fontSize: 15, fontWeight: 900,
                  borderRadius: 12, padding: '16px 18px',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(191,0,0,0.3)',
                }}
              >
                🛍️ 楽天ROOMで見る
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── 2位・3位：補助表示 ────────────────────────────────────
  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${accent}44`,
      borderRadius: 14,
      padding: '14px 16px 12px',
      marginBottom: 10,
      boxShadow: '0 2px 10px rgba(15,23,42,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 52, height: 52,
          background: lightBg,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, flexShrink: 0,
        }}>
          {emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {badge && (
            <span style={{
              display: 'inline-block',
              background: `${accent}22`, color: accent,
              fontSize: 11, fontWeight: 800,
              borderRadius: 20, padding: '2px 10px', marginBottom: 5,
              border: `1px solid ${accent}44`,
            }}>
              {badge}
            </span>
          )}
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', lineHeight: 1.4, marginBottom: 3 }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7 }}>
            {description}
          </div>
          <div style={{ fontSize: 13, color: accent, fontWeight: 800, marginTop: 4 }}>
            {price}
          </div>
        </div>
      </div>

      {painText && (
        <div style={{
          fontSize: 12, color: '#B91C1C', fontWeight: 700,
          background: '#FEF2F2', borderRadius: 8,
          padding: '6px 12px', marginBottom: 10,
        }}>
          ⚠️ {painText}
        </div>
      )}

      {trustText && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: 20, padding: '3px 10px', marginBottom: 10,
          fontSize: 11, color: '#15803D', fontWeight: 700,
        }}>
          ✅ {trustText}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {resolvedAmazonUrl && (
          <a href={resolvedAmazonUrl} target="_blank" rel="noopener noreferrer sponsored"
            style={{
              flex: '1 1 120px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              background: '#FF9900', color: '#111',
              fontSize: 13, fontWeight: 900,
              borderRadius: 9, padding: '11px 14px',
              textDecoration: 'none', whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(255,153,0,0.3)',
            }}
          >
            🛒 Amazonで見る
          </a>
        )}
        {resolvedRakutenUrl && (
          <a href={resolvedRakutenUrl} target="_blank" rel="noopener noreferrer sponsored"
            style={{
              flex: '1 1 120px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              background: '#BF0000', color: 'white',
              fontSize: 13, fontWeight: 900,
              borderRadius: 9, padding: '11px 14px',
              textDecoration: 'none', whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(191,0,0,0.2)',
            }}
          >
            🛍️ 楽天ROOMで見る
          </a>
        )}
      </div>
    </div>
  )
}
