'use client'

import { useState, useCallback } from 'react'
import type { LinkEntry } from './page'

type StatusResult = {
  status: number
  ok: boolean
  redirected?: boolean
  location?: string | null
  error?: string
}

type HttpState = Record<string, StatusResult | 'loading'>

function StatusBadge({ state }: { state: StatusResult | 'loading' | undefined }) {
  if (!state) return null
  if (state === 'loading') {
    return (
      <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>確認中…</span>
    )
  }
  const { status, ok, redirected, error } = state
  if (error && status === 0) {
    return (
      <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>
        ✗ {error}
      </span>
    )
  }
  if (redirected) {
    return (
      <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706' }}>
        → {status}
      </span>
    )
  }
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: ok ? '#15803D' : '#DC2626' }}>
      {ok ? `✓ ${status}` : `✗ ${status}`}
    </span>
  )
}

export default function AuditClient({ links }: { links: LinkEntry[] }) {
  const [httpState, setHttpState] = useState<HttpState>({})
  const [checking, setChecking] = useState(false)
  const [filter, setFilter] = useState<'all' | 'issues'>('all')
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

  const checkUrl = useCallback(async (url: string) => {
    setHttpState((prev) => ({ ...prev, [url]: 'loading' }))
    try {
      const res = await fetch(`/api/affiliate-check?url=${encodeURIComponent(url)}`)
      const data: StatusResult = await res.json()
      setHttpState((prev) => ({ ...prev, [url]: data }))
    } catch {
      setHttpState((prev) => ({ ...prev, [url]: { status: 0, ok: false, error: '接続失敗' } }))
    }
  }, [])

  const checkAll = useCallback(async () => {
    setChecking(true)
    for (const link of links) {
      await checkUrl(link.url)
      // 短いウェイトでサーバー負荷を分散
      await new Promise((r) => setTimeout(r, 300))
    }
    setChecking(false)
  }, [links, checkUrl])

  const displayed = filter === 'issues' ? links.filter((l) => l.issues.length > 0) : links

  // 商品ごとにグループ化
  const grouped = displayed.reduce<Record<string, { name: string; emoji: string; slug: string; entries: LinkEntry[] }>>(
    (acc, l) => {
      if (!acc[l.mangaSlug]) {
        acc[l.mangaSlug] = { name: l.productName, emoji: l.productEmoji, slug: l.mangaSlug, entries: [] }
      }
      acc[l.mangaSlug].entries.push(l)
      return acc
    },
    {},
  )

  return (
    <div>
      {/* ── ツールバー ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap',
      }}>
        <button
          onClick={checkAll}
          disabled={checking}
          style={{
            background: checking ? '#94A3B8' : '#1E40AF',
            color: 'white', border: 'none', borderRadius: 8,
            padding: '9px 18px', fontSize: 13, fontWeight: 700,
            cursor: checking ? 'not-allowed' : 'pointer',
          }}
        >
          {checking ? '確認中…' : '🌐 全件 HTTP チェック'}
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'issues'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#0F172A' : '#F1F5F9',
                color: filter === f ? 'white' : '#64748B',
                border: 'none', borderRadius: 8,
                padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {f === 'all' ? `全件 (${links.length})` : `⚠ 問題のみ (${links.filter(l => l.issues.length > 0).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── 商品グループ別テーブル ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.values(grouped).map((group) => {
          const hasIssues = group.entries.some((e) => e.issues.length > 0)
          const isExpanded = expandedProduct === group.slug || hasIssues

          return (
            <div key={group.slug} style={{
              background: 'white',
              border: `1.5px solid ${hasIssues ? '#FECACA' : '#E2E8F0'}`,
              borderRadius: 14, overflow: 'hidden',
            }}>
              {/* 商品ヘッダー */}
              <button
                onClick={() => setExpandedProduct(isExpanded && expandedProduct === group.slug ? null : group.slug)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: hasIssues ? '#FEF2F2' : '#F8FAFC',
                  border: 'none', cursor: 'pointer',
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none',
                }}
              >
                <span style={{ fontSize: 20 }}>{group.emoji}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', flex: 1 }}>{group.name}</span>
                <span style={{ fontSize: 11, color: '#64748B', background: '#F1F5F9', borderRadius: 20, padding: '2px 8px' }}>
                  {group.slug}
                </span>
                {hasIssues && (
                  <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 800, background: '#FEE2E2', borderRadius: 20, padding: '2px 8px' }}>
                    ⚠ {group.entries.filter(e => e.issues.length > 0).length} 件の問題
                  </span>
                )}
                <span style={{ fontSize: 14, color: '#94A3B8' }}>{isExpanded ? '▲' : '▼'}</span>
              </button>

              {/* リンク詳細 */}
              {isExpanded && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC' }}>
                        {['種別', '商品ラベル', 'ドメイン', 'タグ状態', 'HTTPステータス', '問題', 'URL'].map((h) => (
                          <th key={h} style={{
                            padding: '8px 12px', textAlign: 'left',
                            fontWeight: 700, color: '#64748B', fontSize: 11,
                            borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {group.entries.map((entry, i) => {
                        const hasIssue = entry.issues.length > 0
                        const httpResult = httpState[entry.url]
                        const httpHasIssue = httpResult && httpResult !== 'loading' &&
                          (!httpResult.ok || httpResult.redirected)

                        return (
                          <tr key={i} style={{
                            background: hasIssue || httpHasIssue ? '#FFF5F5' : 'white',
                            borderBottom: '1px solid #F1F5F9',
                          }}>
                            {/* 種別 */}
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              <span style={{
                                fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '3px 8px',
                                background: entry.urlType === 'amazon' ? '#FFF7ED' : '#FEF2F2',
                                color: entry.urlType === 'amazon' ? '#C2410C' : '#DC2626',
                              }}>
                                {entry.urlType === 'amazon' ? '🛒 Amazon' : '🔴 楽天'}
                              </span>
                              {entry.role === 'alternative' && (
                                <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 4 }}>代替</span>
                              )}
                            </td>
                            {/* 商品ラベル */}
                            <td style={{ padding: '10px 12px', color: '#0F172A', maxWidth: 200 }}>
                              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {entry.label}
                              </div>
                            </td>
                            {/* ドメイン */}
                            <td style={{ padding: '10px 12px', color: '#64748B', whiteSpace: 'nowrap' }}>
                              {entry.domain}
                            </td>
                            {/* タグ状態 */}
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              {entry.urlType === 'amazon' ? (
                                entry.amazonTag ? (
                                  <span style={{ color: '#15803D', fontWeight: 700 }}>✓ {entry.amazonTag}</span>
                                ) : (
                                  <span style={{ color: '#DC2626', fontWeight: 700 }}>✗ tag= なし</span>
                                )
                              ) : (
                                entry.rakutenAffId ? (
                                  <span style={{ color: '#15803D', fontWeight: 700 }}>✓ {entry.rakutenAffId}</span>
                                ) : (
                                  <span style={{ color: '#DC2626', fontWeight: 700 }}>✗ aff_id= なし</span>
                                )
                              )}
                            </td>
                            {/* HTTP ステータス */}
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <StatusBadge state={httpState[entry.url]} />
                                {!httpState[entry.url] && (
                                  <button
                                    onClick={() => checkUrl(entry.url)}
                                    style={{
                                      fontSize: 10, color: '#1E40AF', background: '#EFF6FF',
                                      border: '1px solid #BFDBFE', borderRadius: 6,
                                      padding: '3px 8px', cursor: 'pointer', fontWeight: 700,
                                    }}
                                  >
                                    確認
                                  </button>
                                )}
                              </div>
                            </td>
                            {/* 問題 */}
                            <td style={{ padding: '10px 12px' }}>
                              {entry.issues.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                  {entry.issues.map((issue, j) => (
                                    <span key={j} style={{
                                      fontSize: 10, fontWeight: 700, color: '#DC2626',
                                      background: '#FEE2E2', borderRadius: 4, padding: '2px 6px',
                                      whiteSpace: 'nowrap',
                                    }}>
                                      ⚠ {issue}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ fontSize: 11, color: '#15803D' }}>—</span>
                              )}
                            </td>
                            {/* URL */}
                            <td style={{ padding: '10px 12px', maxWidth: 220 }}>
                              <a
                                href={entry.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: 11, color: '#2563EB', textDecoration: 'underline',
                                  display: 'block', overflow: 'hidden', textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                title={entry.url}
                              >
                                {entry.url}
                              </a>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
