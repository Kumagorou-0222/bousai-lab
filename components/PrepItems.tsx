import Link from 'next/link'
import type { PrepItem } from '@/lib/articles'

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? 'bousailab-22'
const RAKUTEN_AFF = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? '103_-1_10000619'

function amazonUrl(query: string) {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`
}
function rakutenUrl(query: string) {
  return `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(query)}/?f=1&RankingId=3&grp=product&scid=af_pc_etc&sc2id=af_${RAKUTEN_AFF}`
}

type Props = {
  items: PrepItem[]
  relatedSlugs?: string[]
  relatedTitles?: Record<string, string>
}

export default function PrepItems({ items, relatedSlugs, relatedTitles }: Props) {
  if (items.length === 0) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFFBEB, #FEF9C3)',
      border: '1.5px solid #FCD34D',
      borderRadius: 18,
      padding: '22px 24px',
      marginTop: 40,
      marginBottom: 8,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#92400E', fontWeight: 800, letterSpacing: '0.06em', marginBottom: 4 }}>
          PREP LIST
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', fontFamily: 'Kaisei Decol, serif' }}>
          🛒 この備えに必要なもの
        </div>
        <div style={{ fontSize: 12, color: '#78716C', marginTop: 4 }}>
          記事で紹介した備えを揃えるためのリストです
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: 'white',
            border: '1px solid #FEF08A',
            borderRadius: 14,
            padding: '16px 18px',
            boxShadow: '0 1px 4px rgba(234,179,8,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#78716C', marginTop: 2 }}>目安: {item.spec}</div>
                {item.reason && (
                  <div style={{
                    fontSize: 12, color: '#44403C', marginTop: 6,
                    background: '#FFFBEB', borderLeft: '3px solid #FCD34D',
                    padding: '4px 8px', borderRadius: '0 6px 6px 0',
                  }}>
                    💡 {item.reason}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href={amazonUrl(item.amazonQuery)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#FF9900', color: 'white',
                  padding: '7px 14px', borderRadius: 8,
                  textDecoration: 'none', fontWeight: 700, fontSize: 12,
                }}
              >
                🛒 Amazon
              </a>
              <a
                href={rakutenUrl(item.rakutenQuery)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#BF0000', color: 'white',
                  padding: '7px 14px', borderRadius: 8,
                  textDecoration: 'none', fontWeight: 700, fontSize: 12,
                }}
              >
                🛒 楽天
              </a>
              {item.compareSlug && (
                <Link
                  href={`/compare/${item.compareSlug}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: '#EFF6FF', color: '#1D4ED8',
                    border: '1px solid #BFDBFE',
                    padding: '7px 12px', borderRadius: 8,
                    textDecoration: 'none', fontWeight: 700, fontSize: 12,
                  }}
                >
                  📊 比較を見る
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {relatedSlugs && relatedSlugs.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed #FCD34D' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>
            📚 関連記事
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {relatedSlugs.slice(0, 3).map((slug) => (
              <Link
                key={slug}
                href={`/articles/${slug}`}
                style={{
                  fontSize: 13, color: '#1D4ED8',
                  textDecoration: 'none', fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                → {relatedTitles?.[slug] ?? slug}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: 10, color: '#A8A29E', marginTop: 14, lineHeight: 1.7 }}>
        ※ Amazon・楽天リンクはアフィリエイトリンクです。購入価格は変わりません。
      </div>
    </div>
  )
}
