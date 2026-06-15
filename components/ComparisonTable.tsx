import type { ProductData } from '@/lib/products'

type Props = {
  comparison: ProductData['comparison']
  accentColor?: string
  amazonUrl?: string
  rakutenUrl?: string
}

export default function ComparisonTable({ comparison, accentColor = '#1E40AF', amazonUrl, rakutenUrl }: Props) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1.5px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: accentColor }}>
              {comparison.headers.map((h, i) => (
                <th key={i} style={{
                  padding: '10px 14px',
                  color: 'white', fontWeight: 700,
                  textAlign: 'left', whiteSpace: 'nowrap',
                  borderRight: i < comparison.headers.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row, ri) => (
              <tr key={ri} style={{
                background: row.recommended ? '#EFF6FF' : ri % 2 === 0 ? 'white' : '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
              }}>
                {row.cols.map((col, ci) => (
                  <td key={ci} style={{
                    padding: '10px 14px',
                    color: row.recommended ? accentColor : '#334155',
                    fontWeight: row.recommended ? 700 : 400,
                    borderRight: ci < row.cols.length - 1 ? '1px solid #E2E8F0' : 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    {ci === 0 && row.recommended && (
                      <span style={{
                        display: 'inline-block',
                        background: accentColor, color: 'white',
                        fontSize: 9, fontWeight: 800,
                        borderRadius: 4, padding: '1px 5px',
                        marginRight: 6, verticalAlign: 'middle',
                      }}>おすすめ</span>
                    )}
                    {col}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {comparison.note && (
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 8, lineHeight: 1.6 }}>
          💡 {comparison.note}
        </p>
      )}

      {(amazonUrl || rakutenUrl) && (
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          {amazonUrl && (
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{
                flex: 1, minWidth: 140,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#FF9900', color: 'white',
                borderRadius: 10, padding: '12px 16px',
                textDecoration: 'none', fontWeight: 700, fontSize: 13,
                boxShadow: '0 2px 8px rgba(255,153,0,0.35)',
              }}
            >
              🛒 Amazonで見る
            </a>
          )}
          {rakutenUrl && (
            <a
              href={rakutenUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{
                flex: 1, minWidth: 140,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#BF0000', color: 'white',
                borderRadius: 10, padding: '12px 16px',
                textDecoration: 'none', fontWeight: 700, fontSize: 13,
                boxShadow: '0 2px 8px rgba(191,0,0,0.3)',
              }}
            >
              🛍 楽天ROOMで見る
            </a>
          )}
        </div>
      )}
    </div>
  )
}
