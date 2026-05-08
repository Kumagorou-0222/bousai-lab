import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { getAllSlugs, getArticleBySlug, getRelatedArticles, CATEGORY_MAP } from '@/lib/articles'
import { buildXPostFromArticle } from '@/lib/xpost'
import Breadcrumb from '@/components/Breadcrumb'
import ArticleCard from '@/components/ArticleCard'
import ProductCard from '@/components/ProductCard'
import CtaButton from '@/components/CtaButton'
import ShareButton from '@/components/ShareButton'
import AdSense from '@/components/AdSense'
import Dialogue from '@/components/Dialogue'
import MangaDialogue from '@/components/MangaDialogue'
import ReasonsList from '@/components/ReasonsList'
import MonetizeLinks from '@/components/MonetizeLinks'
import XPostBox from '@/components/XPostBox'

type Props = { params: Promise<{ slug: string }> }

const BASE_URL = 'https://bousai-lab.vercel.app'

const CATEGORY_COLORS: Record<string, { bg: string; text: string; light: string }> = {
  earthquake:      { bg: '#FEF2F2', text: '#DC2626', light: '#FECACA' },
  typhoon:         { bg: '#EFF6FF', text: '#2563EB', light: '#BFDBFE' },
  blackout:        { bg: '#FFFBEB', text: '#D97706', light: '#FDE68A' },
  evacuation:      { bg: '#F0FDF4', text: '#16A34A', light: '#BBF7D0' },
  'disaster-prep': { bg: '#F8FAFC', text: '#475569', light: '#CBD5E1' },
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const article = getArticleBySlug(slug)
    const cat = CATEGORY_MAP[article.category]
    return {
      title: article.title,
      description: article.description,
      authors: [{ name: 'くまごろう（武蔵野市在住の現役勤務医師）' }],
      alternates: { canonical: `${BASE_URL}/articles/${slug}` },
      openGraph: {
        title: article.title,
        description: article.description,
        url: `${BASE_URL}/articles/${slug}`,
        type: 'article',
        publishedTime: article.date,
        modifiedTime: article.updatedDate ?? article.date,
        authors: ['くまごろう'],
        tags: [cat.label, '防災', '今すぐやること'],
        images: [{
          url: `${BASE_URL}/og?title=${encodeURIComponent(article.title)}&category=${article.category}&emoji=${encodeURIComponent(article.emoji ?? '🛡️')}`,
          width: 1200,
          height: 630,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.description,
      },
    }
  } catch {
    return { title: '記事が見つかりません' }
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  let article
  try {
    article = getArticleBySlug(slug)
  } catch {
    notFound()
  }

  const cat = CATEGORY_MAP[article.category]
  const related = getRelatedArticles(article)
  const articleUrl = `${BASE_URL}/articles/${slug}`
  const colors = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS['disaster-prep']
  const xPost = buildXPostFromArticle(article)

  const authorSchema = {
    '@type': 'Person',
    name: 'くまごろう',
    jobTitle: '医師',
    url: `${BASE_URL}/about`,
    sameAs: `${BASE_URL}/about`,
    knowsAbout: ['防災', '在宅避難', '災害医療', '感染症対策'],
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updatedDate ?? article.date,
    author: authorSchema,
    reviewedBy: authorSchema,
    publisher: {
      '@type': 'Organization',
      name: '防災Lab',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: cat.label, item: `${BASE_URL}/category/${article.category}` },
      { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
    ],
  }

  const faqJsonLd = article.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null

  const shareTextMap: Record<string, string> = {
    earthquake: `地震来た人これ見て\n→今やること3つ\n\n${article.title}`,
    blackout: `停電したらこれ見て\n→今すぐやること\n\n${article.title}`,
    typhoon: `台風が来る前にこれ見て\n→今すぐ準備すること\n\n${article.title}`,
    evacuation: `避難が必要なときこれ見て\n→今すぐやること\n\n${article.title}`,
    'disaster-prep': `防災グッズの準備これ見て\n\n${article.title}`,
  }
  const shareText = shareTextMap[article.category] ?? `【防災Lab】${article.title}`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: cat.label, href: `/category/${article.category}` },
          { label: article.title },
        ]} />

        {/* ① 記事ヘッダー */}
        <div style={{
          background: colors.bg,
          border: `1.5px solid ${colors.light}`,
          borderRadius: 18, padding: '28px 24px', marginBottom: 32, textAlign: 'center',
        }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>{article.emoji}</div>
          <div style={{
            display: 'inline-block',
            background: colors.text, color: 'white',
            fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '4px 14px', marginBottom: 14,
          }}>
            {cat.emoji} {cat.label}
          </div>
          <h1 style={{
            fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 900,
            lineHeight: 1.4, color: '#0F172A', marginBottom: 12,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none' }}>
              🩺 くまごろう（現役勤務医師）
            </Link>
            <span style={{ fontSize: 12, color: '#CBD5E1' }}>|</span>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>{article.date}</span>
            {article.updatedDate && article.updatedDate !== article.date && (
              <>
                <span style={{ fontSize: 12, color: '#CBD5E1' }}>|</span>
                <span style={{ fontSize: 12, color: '#D97706', fontWeight: 600 }}>更新: {article.updatedDate}</span>
              </>
            )}
          </div>
        </div>

        {/* ② 結論ボックス（最上部に1行） */}
        {article.conclusion && (
          <div style={{
            background: colors.bg,
            border: `2px solid ${colors.text}`,
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{
              fontSize: 16, fontWeight: 800,
              color: colors.text, margin: 0, lineHeight: 1.55,
              fontFamily: 'Kaisei Decol, serif',
            }}>
              結論：{article.conclusion}
            </p>
          </div>
        )}

        {/* ③ 4コマ漫画 */}
        {article.manga && article.manga.panels.length > 0 && (
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 700, color: '#64748B',
              background: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: 20, padding: '4px 12px', marginBottom: 10,
            }}>
              <span>🎬</span>
              <span>4コマで理解</span>
              {/* 将来的に画像版へ置換しやすい構造 */}
            </div>
            <MangaDialogue panels={article.manga.panels} />
          </div>
        )}

        {/* ④ 理由3つ */}
        {article.reasons && article.reasons.length > 0 && (
          <ReasonsList reasons={article.reasons} color={colors.text} />
        )}

        {/* ⑤ 記事本文 */}
        <article className="prose-bousai">
          <MDXRemote
            source={article.content}
            components={{ ProductCard, CtaButton, Dialogue, MangaDialogue }}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>

        {/* 武蔵野市ブロック */}
        {article.region && (
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            border: '2px solid #FCD34D',
            borderRadius: 16,
            padding: '20px 22px',
            marginTop: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>📍</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#92400E' }}>
                【{article.region.name}の場合】
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#78350F', lineHeight: 1.75, margin: 0 }}>
              {article.region.content}
            </p>
            <a href="/musashino" style={{
              fontSize: 13, color: '#B45309', fontWeight: 700,
              textDecoration: 'none',
            }}>
              ▶ 武蔵野市の防災ガイドを見る →
            </a>
          </div>
        )}

        {/* 中盤広告 */}
        <AdSense slot="2847651930" format="auto" />

        {/* ⑥ 収益導線（チェックリスト → 商品） */}
        <MonetizeLinks
          category={article.category}
          items={article.monetizeItems}
        />

        {/* 中盤CTA（カテゴリ別） */}
        <CtaButton category={article.category} />

        {/* SNSシェア */}
        <ShareButton title={article.title} url={articleUrl} shareText={shareText} />

        {/* ⑦ X投稿文生成ボックス */}
        <XPostBox short={xPost.short} normal={xPost.normal} />

        {/* ⑧ FAQ */}
        {article.faqs.length > 0 && (
          <section style={{
            background: '#F8FAFC', borderRadius: 16, padding: 28, marginTop: 40,
            border: '1px solid #E2E8F0',
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, color: '#0F172A' }}>
              ❓ よくある質問
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {article.faqs.map((faq, i) => (
                <details key={i} style={{
                  background: 'white', borderRadius: 12, padding: '14px 18px',
                  border: '1px solid #E2E8F0',
                }}>
                  <summary style={{
                    fontWeight: 700, fontSize: 14, cursor: 'pointer', color: '#0F172A',
                    listStyle: 'none', display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ color: '#2563EB', fontWeight: 900, fontSize: 16 }}>Q</span>
                    {faq.question}
                  </summary>
                  <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, color: '#475569', paddingLeft: 26 }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ⑨ 著者 */}
        <div style={{
          background: 'white',
          border: '1.5px solid #E2E8F0',
          borderRadius: 16, padding: 24, marginTop: 40,
          boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              borderRadius: 14, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 26, flexShrink: 0,
            }}>🐻</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#2563EB', fontWeight: 700, marginBottom: 3, letterSpacing: '0.06em' }}>
                この記事の著者・監修者
              </div>
              <Link href="/about" style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', textDecoration: 'none' }}>
                くまごろう
              </Link>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, marginTop: 4 }}>
                🩺 武蔵野市在住・現役勤務医師 ／ 🏢 マンションオーナー<br />
                医師の視点から防災・在宅避難情報を発信。
              </div>
              <Link href="/about" style={{
                fontSize: 12, color: '#2563EB', fontWeight: 700,
                textDecoration: 'none', marginTop: 6, display: 'inline-block',
              }}>
                詳しいプロフィール →
              </Link>
            </div>
          </div>
        </div>

        {/* ⑩ 関連記事 */}
        {related.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={{
              fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#0F172A',
              fontFamily: 'Kaisei Decol, serif',
            }}>
              📚 次に読むべき記事
            </h2>
            <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
              関連する防災行動ガイドをチェックしておきましょう
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {related.map((a) => (
                <Link key={a.slug} href={`/articles/${a.slug}`} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'white', borderRadius: 12, padding: '14px 16px',
                  textDecoration: 'none', color: '#0F172A',
                  border: '1.5px solid #E2E8F0',
                }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{a.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      {CATEGORY_MAP[a.category].emoji} {CATEGORY_MAP[a.category].label}
                    </div>
                  </div>
                  <span style={{ color: '#2563EB', fontSize: 18, flexShrink: 0 }}>›</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 次に読む（固定導線） */}
        <section style={{
          marginTop: 40,
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '20px 20px',
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748B', margin: '0 0 14px', letterSpacing: '0.05em' }}>
            📖 次に読む
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/musashino" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              border: '1.5px solid #FCD34D',
              borderRadius: 12, padding: '12px 16px',
              textDecoration: 'none', color: '#92400E', fontWeight: 700, fontSize: 13,
            }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <span style={{ flex: 1 }}>武蔵野市の防災ガイドを見る</span>
              <span style={{ color: '#D97706', fontSize: 16 }}>›</span>
            </Link>
            {related.slice(0, 2).map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'white', border: '1.5px solid #E2E8F0',
                borderRadius: 12, padding: '12px 16px',
                textDecoration: 'none', color: '#0F172A', fontSize: 13,
              }}>
                <span style={{ fontSize: 18 }}>{a.emoji}</span>
                <span style={{ flex: 1, fontWeight: 600, lineHeight: 1.4 }}>{a.title}</span>
                <span style={{ color: '#94A3B8', fontSize: 16 }}>›</span>
              </Link>
            ))}
            <Link href="/checklist" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
              border: '1.5px solid #BBF7D0',
              borderRadius: 12, padding: '12px 16px',
              textDecoration: 'none', color: '#15803D', fontWeight: 700, fontSize: 13,
            }}>
              <span style={{ fontSize: 18 }}>📋</span>
              <span style={{ flex: 1 }}>防災チェックリストで備えを確認する</span>
              <span style={{ color: '#16A34A', fontSize: 16 }}>›</span>
            </Link>
          </div>
        </section>

        {/* 末尾CTA */}
        <CtaButton category={article.category} variant="end" />

        {/* 末尾広告 */}
        <AdSense slot="5193847620" format="auto" />
      </div>
    </>
  )
}
