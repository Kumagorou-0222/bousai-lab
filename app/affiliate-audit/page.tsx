import type { Metadata } from 'next'
import { PRODUCTS } from '@/lib/products'
import { getAllArticlesMeta } from '@/lib/articles'
import { getAmazonTagStatus, getRakutenAffStatus } from '@/lib/affiliateConfig'
import AuditClient from './AuditClient'

// 環境変数を毎回リクエスト時に読み込むため動的レンダリングにする
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'アフィリエイト監査 | 防災Lab 管理',
  robots: { index: false, follow: false },
}

export type TagStatus = {
  tag: string | null
  source: 'url' | 'env' | null
}

export type LinkEntry = {
  productName: string
  productEmoji: string
  mangaSlug: string
  role: 'featured' | 'alternative'
  label: string
  urlType: 'amazon' | 'rakuten'
  url: string | null          // null = 準備中
  domain: string | null
  amazonTagStatus: TagStatus
  rakutenAffStatus: TagStatus
  isDuplicate: boolean
  issues: string[]
  usedByArticles: string[]
}

function getDomain(url: string): string {
  try { return new URL(url).hostname } catch { return '不正なURL' }
}

export default function AffiliateAuditPage() {
  const articles = getAllArticlesMeta()

  // mangaSlug → 使用記事スラグ一覧
  const usageMap: Record<string, string[]> = {}
  for (const a of articles) {
    if (a.mangaSlug) {
      usageMap[a.mangaSlug] = usageMap[a.mangaSlug] ?? []
      usageMap[a.mangaSlug].push(a.slug)
    }
  }

  // 全URLを収集して重複チェック（nullは除外）
  const urlCount: Record<string, number> = {}
  for (const p of PRODUCTS) {
    const candidates = [
      p.featured.amazonUrl,
      p.featured.rakutenUrl,
      ...(p.alternatives?.flatMap(a => [a.amazonUrl, a.rakutenUrl ?? undefined]) ?? []),
    ]
    for (const u of candidates) {
      if (u) urlCount[u] = (urlCount[u] ?? 0) + 1
    }
  }

  // LinkEntry 生成
  const links: LinkEntry[] = []
  for (const p of PRODUCTS) {
    const used = usageMap[p.mangaSlug] ?? []

    const addLink = (
      url: string | undefined,
      urlType: 'amazon' | 'rakuten',
      label: string,
      role: 'featured' | 'alternative',
    ) => {
      const resolvedUrl = url ?? null
      const issues: string[] = []

      if (urlType === 'amazon') {
        const tagStatus = getAmazonTagStatus(resolvedUrl ?? undefined)
        if (!tagStatus.tag) issues.push('Amazon tag= 未設定')
        if (resolvedUrl && (urlCount[resolvedUrl] ?? 0) > 1) issues.push('URL重複')
        if (resolvedUrl && !resolvedUrl.startsWith('http')) issues.push('無効URL')

        links.push({
          productName: p.name,
          productEmoji: p.emoji,
          mangaSlug: p.mangaSlug,
          role,
          label,
          urlType,
          url: resolvedUrl,
          domain: resolvedUrl ? getDomain(resolvedUrl) : null,
          amazonTagStatus: tagStatus,
          rakutenAffStatus: { tag: null, source: null },
          isDuplicate: resolvedUrl ? (urlCount[resolvedUrl] ?? 0) > 1 : false,
          issues,
          usedByArticles: used,
        })
      } else {
        const affStatus = getRakutenAffStatus(resolvedUrl ?? undefined)
        if (!affStatus.tag) issues.push('Rakuten aff_id= 未設定')
        if (resolvedUrl && (urlCount[resolvedUrl] ?? 0) > 1) issues.push('URL重複')
        if (resolvedUrl && !resolvedUrl.startsWith('http')) issues.push('無効URL')

        links.push({
          productName: p.name,
          productEmoji: p.emoji,
          mangaSlug: p.mangaSlug,
          role,
          label,
          urlType,
          url: resolvedUrl,
          domain: resolvedUrl ? getDomain(resolvedUrl) : null,
          amazonTagStatus: { tag: null, source: null },
          rakutenAffStatus: affStatus,
          isDuplicate: resolvedUrl ? (urlCount[resolvedUrl] ?? 0) > 1 : false,
          issues,
          usedByArticles: used,
        })
      }
    }

    addLink(p.featured.amazonUrl, 'amazon', p.featured.name, 'featured')
    addLink(p.featured.rakutenUrl, 'rakuten', p.featured.name, 'featured')
    for (const alt of p.alternatives ?? []) {
      addLink(alt.amazonUrl, 'amazon', alt.name, 'alternative')
      if (alt.rakutenUrl !== undefined) addLink(alt.rakutenUrl, 'rakuten', alt.name, 'alternative')
    }
  }

  const totalLinks = links.length
  const totalIssues = links.filter(l => l.issues.length > 0).length
  const amazonTagMissing = links.filter(l => l.urlType === 'amazon' && !l.amazonTagStatus.tag).length
  const rakutenAffMissing = links.filter(l => l.urlType === 'rakuten' && !l.rakutenAffStatus.tag).length
  const duplicates = links.filter(l => l.isDuplicate).length
  const urlUnset = links.filter(l => l.url === null).length

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'system-ui, sans-serif' }}>
      {/* ── ヘッダー ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>
          ADMIN / AFFILIATE AUDIT
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0 }}>
          🔍 アフィリエイトリンク監査
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', marginTop: 6 }}>
          lib/products.ts のすべての外部リンクを静的解析 + HTTP ステータス確認
        </p>
        {/* 環境変数ステータス */}
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG', value: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG },
            { label: 'NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID', value: process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID },
          ].map(({ label, value }) => (
            <div key={label} style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 700,
              background: value ? '#F0FDF4' : '#FEF2F2',
              color: value ? '#15803D' : '#DC2626',
              border: `1px solid ${value ? '#BBF7D0' : '#FECACA'}`,
            }}>
              {value ? `✓ ${label} = ${value}` : `✗ ${label} 未設定`}
            </div>
          ))}
        </div>
      </div>

      {/* ── サマリー ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: '総リンク数', value: totalLinks, color: '#1E40AF', bg: '#EFF6FF' },
          { label: '問題あり', value: totalIssues, color: totalIssues > 0 ? '#DC2626' : '#15803D', bg: totalIssues > 0 ? '#FEF2F2' : '#F0FDF4', warn: totalIssues > 0 },
          { label: 'Amazon tag= 未設定', value: amazonTagMissing, color: amazonTagMissing > 0 ? '#DC2626' : '#15803D', bg: amazonTagMissing > 0 ? '#FEF2F2' : '#F0FDF4', warn: amazonTagMissing > 0 },
          { label: 'Rakuten aff 未設定', value: rakutenAffMissing, color: rakutenAffMissing > 0 ? '#DC2626' : '#15803D', bg: rakutenAffMissing > 0 ? '#FEF2F2' : '#F0FDF4', warn: rakutenAffMissing > 0 },
          { label: 'URL重複', value: duplicates, color: duplicates > 0 ? '#D97706' : '#15803D', bg: duplicates > 0 ? '#FFFBEB' : '#F0FDF4', warn: duplicates > 0 },
          { label: 'URL未設定（準備中）', value: urlUnset, color: '#7C3AED', bg: '#F5F3FF', warn: false },
        ].map((s) => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 12, padding: '14px 16px',
            border: `1.5px solid ${s.color}40`,
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            {(s as { warn?: boolean }).warn && <div style={{ fontSize: 10, color: '#DC2626', fontWeight: 700, marginTop: 4 }}>⚠ WARNING</div>}
          </div>
        ))}
      </div>

      {/* ── インタラクティブ部分（クライアント） ── */}
      <AuditClient links={links} />

      {/* ── 記事使用状況 ── */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
          📚 商品別・記事使用状況
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PRODUCTS.map((p) => {
            const used = usageMap[p.mangaSlug] ?? []
            return (
              <div key={p.mangaSlug} style={{
                background: used.length > 0 ? '#F8FAFC' : '#FEF2F2',
                border: `1.5px solid ${used.length > 0 ? '#E2E8F0' : '#FECACA'}`,
                borderRadius: 12, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: used.length > 0 ? 8 : 0 }}>
                  <span style={{ fontSize: 18 }}>{p.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: '#64748B', background: '#F1F5F9', borderRadius: 20, padding: '2px 8px' }}>
                    {p.mangaSlug}
                  </span>
                  {used.length === 0 && (
                    <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>⚠ 未使用</span>
                  )}
                </div>
                {used.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {used.map((slug) => (
                      <a key={slug} href={`/articles/${slug}`} target="_blank" rel="noopener" style={{
                        fontSize: 11, color: '#1E40AF', background: '#EFF6FF',
                        border: '1px solid #BFDBFE', borderRadius: 20, padding: '3px 10px',
                        textDecoration: 'none', fontWeight: 600,
                      }}>
                        {slug}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── URL設定ガイド ── */}
      <section style={{
        marginTop: 32, background: '#EFF6FF', border: '1.5px solid #BFDBFE',
        borderRadius: 12, padding: '16px 18px',
      }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#1E40AF', marginBottom: 8 }}>
          📋 URL設定ガイド
        </div>
        <div style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.8 }}>
          <div><strong>Amazon:</strong> <code>.env.local</code> に <code>NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG=bousailab0c-22</code> を設定すると全Amazon URLに自動付与されます。</div>
          <div style={{ marginTop: 6 }}><strong>楽天:</strong> 楽天アフィリエイトポータルで生成した <code>hb.afl.rakuten.co.jp/hgc/...</code> URLを <code>lib/products.ts</code> の <code>rakutenUrl</code> に直接貼ってください。または <code>NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID</code> を設定すると通常の楽天URLを自動変換します。</div>
          <div style={{ marginTop: 6 }}><strong>準備中:</strong> <code>amazonUrl</code> または <code>rakutenUrl</code> を <code>undefined</code> にすると「準備中」と表示し、壊れたリンクは出力されません。</div>
        </div>
      </section>

      {/* ── PRODUCT_MAP の注記 ── */}
      <section style={{
        marginTop: 20, background: '#FFFBEB', border: '1.5px solid #FCD34D',
        borderRadius: 12, padding: '16px 18px',
      }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#92400E', marginBottom: 6 }}>
          ℹ️ PRODUCT_MAP（lib/articles.ts）について
        </div>
        <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.7, margin: 0 }}>
          PRODUCT_MAP のリンクはすべてサイト内部リンク（/checklist, /best-disaster-items 等）のため、
          外部アフィリエイトURLを含みません。外部リンクは上記 PRODUCTS（lib/products.ts）で管理されています。
        </p>
      </section>
    </div>
  )
}
