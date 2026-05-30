import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { COMPARE_DATA, amazonUrl, rakutenUrl } from '@/lib/compareData'

type Props = { params: Promise<{ product: string }> }

export async function generateStaticParams() {
  return Object.keys(COMPARE_DATA).map((product) => ({ product }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await params
  const data = COMPARE_DATA[product]
  if (!data) return {}
  return {
    title: `${data.name}の選び方・比較【防災向け2026年版】｜防災Lab`,
    description: `${data.conclusion} 現役医師が解説する${data.name}の防災向け選び方・タイプ別比較。`,
    robots: { index: true, follow: true },
  }
}

export default async function ComparePage({ params }: Props) {
  const { product } = await params
  const data = COMPARE_DATA[product]
  if (!data) notFound()

  const recommended = data.rows.find((r) => r.recommended)

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px 80px' }}>

      {/* パンくず */}
      <nav style={{ fontSize: 12, color: '#94A3B8', padding: '16px 0 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>防災Lab</Link>
        <span>›</span>
        <Link href="/best-disaster-items" style={{ color: '#94A3B8', textDecoration: 'none' }}>防災グッズ</Link>
        <span>›</span>
        <span style={{ color: '#475569' }}>{data.name}の選び方・比較</span>
      </nav>

      {/* ヘッダー */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700,
          color: '#1D4ED8', background: '#EFF6FF', border: '1px solid #BFDBFE',
          borderRadius: 20, padding: '3px 12px', marginBottom: 10,
        }}>
          📊 比較・選び方ガイド
        </div>
        <h1 style={{
          fontSize: 'clamp(20px, 4.5vw, 26px)', fontWeight: 900,
          color: '#0F172A', lineHeight: 1.4, marginBottom: 8,
          fontFamily: 'Kaisei Decol, serif',
        }}>
          {data.emoji} {data.name}の選び方・比較<br />
          <span style={{ fontSize: '0.75em', color: '#64748B', fontWeight: 700 }}>
            【防災向け2026年版】
          </span>
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.8 }}>
          監修：くまごろう（現役勤務医）
        </p>
      </div>

      {/* 結論ボックス */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
        border: '2px solid #FB923C',
        borderRadius: 14, padding: '16px 20px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#C2410C', marginBottom: 6 }}>
          💡 この記事の結論
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#7C2D12', lineHeight: 1.7 }}>
          {data.conclusion}
        </p>
      </div>

      {/* 導入文 */}
      <div style={{ marginBottom: 28 }}>
        {data.intro.map((para, i) => (
          <p key={i} style={{
            fontSize: 14, color: '#334155', lineHeight: 1.9,
            marginBottom: i < data.intro.length - 1 ? 12 : 0,
          }}>
            {para}
          </p>
        ))}
      </div>

      {/* 選び方のポイント */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 18, fontWeight: 800, color: '#0F172A',
          borderLeft: '4px solid #1D4ED8', paddingLeft: 12,
          marginBottom: 14,
        }}>
          選び方のポイント
        </h2>
        <div style={{
          background: '#EFF6FF', border: '1.5px solid #BFDBFE',
          borderRadius: 12, padding: '16px 20px',
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.selectionGuide.map((point, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: '#1E3A8A', lineHeight: 1.7 }}>
                <span style={{ color: '#16A34A', fontWeight: 800, flexShrink: 0 }}>✅</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 比較表 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 18, fontWeight: 800, color: '#0F172A',
          borderLeft: '4px solid #1D4ED8', paddingLeft: 12,
          marginBottom: 14,
        }}>
          タイプ別比較表
        </h2>
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1.5px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#0F172A', color: 'white' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>タイプ</th>
                {data.columns.map((col, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700, whiteSpace: 'nowrap', borderLeft: '1px solid #334155' }}>
                    {col}
                  </th>
                ))}
                <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700, whiteSpace: 'nowrap', borderLeft: '1px solid #334155' }}>
                  購入
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, ri) => (
                <tr key={ri} style={{
                  background: row.recommended ? '#EFF6FF' : ri % 2 === 0 ? 'white' : '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {row.recommended && (
                      <span style={{
                        display: 'inline-block', background: '#1D4ED8', color: 'white',
                        fontSize: 10, fontWeight: 800, borderRadius: 4, padding: '2px 6px', marginRight: 6,
                      }}>
                        おすすめ
                      </span>
                    )}
                    {row.label}
                  </td>
                  {row.cols.map((col, ci) => (
                    <td key={ci} style={{
                      padding: '12px', whiteSpace: 'nowrap', borderLeft: '1px solid #F1F5F9',
                      color: row.recommended ? '#1E3A8A' : '#475569',
                      fontWeight: row.recommended ? 600 : 400,
                      verticalAlign: 'top',
                    }}>
                      {col}
                    </td>
                  ))}
                  <td style={{ padding: '12px', borderLeft: '1px solid #F1F5F9', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {row.amazonQuery && (
                        <a href={amazonUrl(row.amazonQuery)} target="_blank" rel="noopener noreferrer sponsored"
                          style={{
                            display: 'inline-flex', alignItems: 'center',
                            background: '#F59E0B', color: 'white',
                            fontSize: 11, fontWeight: 800, padding: '4px 10px',
                            borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap',
                          }}>
                          Amazon
                        </a>
                      )}
                      {row.rakutenQuery && (
                        <a href={rakutenUrl(row.rakutenQuery)} target="_blank" rel="noopener noreferrer sponsored"
                          style={{
                            display: 'inline-flex', alignItems: 'center',
                            background: '#DC2626', color: 'white',
                            fontSize: 11, fontWeight: 800, padding: '4px 10px',
                            borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap',
                          }}>
                          楽天
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.tableNote && (
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 8, lineHeight: 1.7 }}>
            💡 {data.tableNote}
          </p>
        )}
      </section>

      {/* 各タイプ詳細レビュー */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 18, fontWeight: 800, color: '#0F172A',
          borderLeft: '4px solid #1D4ED8', paddingLeft: 12,
          marginBottom: 14,
        }}>
          タイプ別おすすめ理由
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.rows.filter((r) => r.reason).map((row, i) => (
            <div key={i} style={{
              background: row.recommended ? '#EFF6FF' : 'white',
              border: `1.5px solid ${row.recommended ? '#93C5FD' : '#E2E8F0'}`,
              borderRadius: 12, padding: '14px 18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: row.recommended ? '#1E3A8A' : '#0F172A' }}>
                  {row.recommended && (
                    <span style={{
                      display: 'inline-block', background: '#1D4ED8', color: 'white',
                      fontSize: 10, fontWeight: 800, borderRadius: 4, padding: '2px 6px', marginRight: 6,
                    }}>
                      おすすめ
                    </span>
                  )}
                  {row.label}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {row.amazonQuery && (
                    <a href={amazonUrl(row.amazonQuery)} target="_blank" rel="noopener noreferrer sponsored"
                      style={{
                        background: '#F59E0B', color: 'white',
                        fontSize: 11, fontWeight: 800, padding: '4px 10px',
                        borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap',
                      }}>
                      Amazon
                    </a>
                  )}
                  {row.rakutenQuery && (
                    <a href={rakutenUrl(row.rakutenQuery)} target="_blank" rel="noopener noreferrer sponsored"
                      style={{
                        background: '#DC2626', color: 'white',
                        fontSize: 11, fontWeight: 800, padding: '4px 10px',
                        borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap',
                      }}>
                      楽天
                    </a>
                  )}
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, margin: 0 }}>
                {row.reason}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* よくある質問 */}
      {data.faqs.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 800, color: '#0F172A',
            borderLeft: '4px solid #1D4ED8', paddingLeft: 12,
            marginBottom: 14,
          }}>
            よくある質問
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.faqs.map((faq, i) => (
              <details key={i} style={{
                background: 'white', border: '1.5px solid #E2E8F0',
                borderRadius: 12, overflow: 'hidden',
              }}>
                <summary style={{
                  padding: '14px 18px', fontWeight: 700, fontSize: 14,
                  color: '#0F172A', cursor: 'pointer', listStyle: 'none',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{
                    flexShrink: 0, background: '#1D4ED8', color: 'white',
                    fontSize: 11, fontWeight: 800, borderRadius: 4,
                    padding: '2px 7px', marginTop: 1,
                  }}>Q</span>
                  {faq.q}
                </summary>
                <div style={{ padding: '0 18px 14px', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingTop: 12 }}>
                    <span style={{
                      flexShrink: 0, background: '#16A34A', color: 'white',
                      fontSize: 11, fontWeight: 800, borderRadius: 4, padding: '2px 7px', marginTop: 1,
                    }}>A</span>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.9, margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* メインCTA */}
      {recommended && (
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #1D4ED8)',
          borderRadius: 16, padding: '22px 24px', marginBottom: 28,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>
            {data.emoji} 防災Labおすすめ
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 6 }}>
            {recommended.label}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, lineHeight: 1.7 }}>
            {recommended.reason}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {recommended.amazonQuery && (
              <a href={amazonUrl(recommended.amazonQuery)} target="_blank" rel="noopener noreferrer sponsored"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#F59E0B', color: 'white',
                  fontSize: 14, fontWeight: 800, padding: '12px 24px',
                  borderRadius: 10, textDecoration: 'none',
                }}>
                🛒 Amazonで見る
              </a>
            )}
            {recommended.rakutenQuery && (
              <a href={rakutenUrl(recommended.rakutenQuery)} target="_blank" rel="noopener noreferrer sponsored"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#DC2626', color: 'white',
                  fontSize: 14, fontWeight: 800, padding: '12px 24px',
                  borderRadius: 10, textDecoration: 'none',
                }}>
                🛒 楽天で見る
              </a>
            )}
          </div>
        </div>
      )}

      {/* 関連記事 */}
      {Object.keys(data.relatedLabels).length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h2 style={{
            fontSize: 16, fontWeight: 800, color: '#0F172A',
            marginBottom: 12,
          }}>
            📚 関連記事
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(data.relatedLabels).map(([slug, label]) => (
              <Link key={slug} href={`/articles/${slug}`} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'white', borderRadius: 10,
                padding: '12px 16px', textDecoration: 'none',
                border: '1px solid #E2E8F0', color: '#0F172A',
              }}>
                <span style={{ color: '#1D4ED8', fontWeight: 700, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 防災グッズ一覧へ */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Link href="/best-disaster-items" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'white', border: '2px solid #E2E8F0',
          color: '#0F172A', fontWeight: 700, fontSize: 14,
          padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
        }}>
          🎒 防災グッズ完全版を見る
        </Link>
      </div>

      <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 1.8 }}>
        ※ Amazon・楽天リンクはアフィリエイトリンクです。
        ご購入価格は通常と変わりません。
      </p>
    </main>
  )
}
