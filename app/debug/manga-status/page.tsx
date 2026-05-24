import { getAllArticlesMeta } from '@/lib/articles'

export const dynamic = 'force-dynamic'
export const metadata = { title: '漫画ステータス | Debug', robots: { index: false } }

type Status = 'image+text' | 'image-only' | 'text-only' | 'default' | 'incomplete'

function getStatus(mangaImages?: string[], panels?: unknown[]): Status {
  const hasImages = (mangaImages?.length ?? 0) > 0
  const panelCount = panels?.length ?? 0

  if (hasImages && panelCount >= 4) return 'image+text'
  if (hasImages) return 'image-only'
  if (panelCount >= 4) return 'text-only'
  if (panelCount > 0) return 'incomplete'
  return 'default'
}

const STATUS_STYLE: Record<Status, { bg: string; color: string; label: string }> = {
  'image+text': { bg: '#DCFCE7', color: '#15803D', label: '✅ 画像＋テキスト' },
  'image-only': { bg: '#DBEAFE', color: '#1D4ED8', label: '🎨 画像のみ' },
  'text-only':  { bg: '#F0FDF4', color: '#16A34A', label: '💬 テキストのみ' },
  'incomplete': { bg: '#FEF9C3', color: '#92400E', label: '⚠️ パネル不足（補完）' },
  'default':    { bg: '#FEE2E2', color: '#DC2626', label: '❗ 未設定（デフォルト）' },
}

export default function MangaStatusPage() {
  const articles = getAllArticlesMeta().sort((a, b) => a.slug.localeCompare(b.slug))

  const counts: Record<Status, number> = {
    'image+text': 0, 'image-only': 0, 'text-only': 0, incomplete: 0, default: 0,
  }
  articles.forEach((a) => {
    counts[getStatus(a.mangaImages, a.manga?.panels)]++
  })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>🎨 漫画ステータス一覧</h1>
      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
        全{articles.length}記事の4コマ漫画設定状況
      </p>

      {/* サマリー */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        {(Object.entries(counts) as [Status, number][]).map(([status, count]) => {
          const s = STATUS_STYLE[status]
          return (
            <div key={status} style={{
              background: s.bg, color: s.color,
              borderRadius: 10, padding: '10px 16px',
              fontWeight: 700, fontSize: 13,
            }}>
              {s.label}：{count}件
            </div>
          )
        })}
      </div>

      {/* 記事一覧 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {articles.map((a) => {
          const status = getStatus(a.mangaImages, a.manga?.panels)
          const s = STATUS_STYLE[status]
          const panelCount = a.manga?.panels?.length ?? 0
          const imageCount = a.mangaImages?.length ?? 0
          const isAlert = status === 'default' || status === 'incomplete'

          return (
            <div key={a.slug} style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              alignItems: 'center',
              gap: 12,
              background: isAlert ? s.bg : 'white',
              border: `1.5px solid ${isAlert ? s.color + '55' : '#E2E8F0'}`,
              borderRadius: 10,
              padding: '10px 14px',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  {a.emoji} {a.title}
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                  {a.slug} ／ {a.category}
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#64748B', textAlign: 'right', whiteSpace: 'nowrap' }}>
                {imageCount > 0 && <div>🖼️ 画像 {imageCount}枚</div>}
                {panelCount > 0 && <div>💬 パネル {panelCount}枚</div>}
                {imageCount === 0 && panelCount === 0 && <div style={{ color: '#DC2626' }}>未設定</div>}
              </div>

              <div style={{
                background: s.bg, color: s.color,
                borderRadius: 8, padding: '4px 10px',
                fontSize: 11, fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
