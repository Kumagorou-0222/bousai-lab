import type { PrepItem } from '@/lib/articles'

type Props = {
  items: PrepItem[]
}

export default function PrepItems({ items }: Props) {
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#78716C', marginTop: 2 }}>目安: {item.spec}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a
                href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(item.amazonQuery)}&tag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? 'bousailab-22'}`}
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
                href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(item.rakutenQuery)}/?f=1&RankingId=3&grp=product&scid=af_pc_etc&sc2id=af_103_-1_10000619`}
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
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: '#A8A29E', marginTop: 14, lineHeight: 1.7 }}>
        ※ Amazon・楽天リンクはアフィリエイトリンクです。購入価格は変わりません。
      </div>
    </div>
  )
}
