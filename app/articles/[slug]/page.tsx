import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { getAllSlugs, getArticleBySlug, getRelatedArticles, CATEGORY_MAP } from '@/lib/articles'
import Breadcrumb from '@/components/Breadcrumb'
import ArticleCard from '@/components/ArticleCard'

type Props = { params: Promise<{ slug: string }> }

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
      alternates: { canonical: `https://bousai-lab.vercel.app/articles/${slug}` },
      openGraph: {
        title: article.title,
        description: article.description,
        url: `https://bousai-lab.vercel.app/articles/${slug}`,
        type: 'article',
        publishedTime: article.date,
        authors: ['くまごろう'],
        tags: [cat.label, '防災', '武蔵野市', '在宅避難'],
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: 'くまごろう',
      jobTitle: '医師',
      address: {
        '@type': 'PostalAddress',
        addressLocality: '武蔵野市',
        addressRegion: '東京都',
        addressCountry: 'JP',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: '在宅避難ラボ',
      url: 'https://bousai-lab.vercel.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bousai-lab.vercel.app/articles/${slug}`,
    },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 80px' }}>
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: cat.label, href: `/category/${article.category}` },
          { label: article.title },
        ]} />

        {/* 記事ヘッダー */}
        <div style={{ background: 'linear-gradient(135deg, #FFF3E0, #FFFDE7)', borderRadius: 20, padding: '40px 32px', marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{article.emoji}</div>
          <div style={{ display: 'inline-block', background: '#FF6B00', color: 'white', fontSize: 12, fontWeight: 700, borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
            {cat.emoji} {cat.label}
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 900, lineHeight: 1.4, color: '#1A1A1A', marginBottom: 12, fontFamily: 'Kaisei Decol, serif' }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#888' }}>🩺 くまごろう（現役勤務医師）</span>
            <span style={{ fontSize: 12, color: '#bbb' }}>|</span>
            <span style={{ fontSize: 12, color: '#888' }}>{article.date}</span>
          </div>
        </div>

        {/* 記事本文 */}
        <article className="prose-bousai">
          <MDXRemote source={article.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </article>

        {/* FAQセクション */}
        {article.faqs.length > 0 && (
          <section style={{ background: '#F8F9FA', borderRadius: 20, padding: 32, marginTop: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1A1A1A' }}>
              ❓ よくある質問
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {article.faqs.map((faq, i) => (
                <details key={i} style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <summary style={{ fontWeight: 700, fontSize: 15, cursor: 'pointer', color: '#1A1A1A', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#FF6B00', fontWeight: 900, fontSize: 18 }}>Q</span>
                    {faq.question}
                  </summary>
                  <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: '#555', paddingLeft: 28 }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* 著者 */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#FFF3E0', borderRadius: 16, padding: 24, marginTop: 48 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FF6B00, #FFD000)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🐻</div>
          <div>
            <div style={{ fontSize: 11, color: '#FF6B00', fontWeight: 700 }}>この記事の著者</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A1A' }}>くまごろう</div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.7, marginTop: 4 }}>
              🩺 武蔵野市在住・現役勤務医師 ／ 🏢 武蔵野市マンションオーナー<br />
              医師の視点から防災・在宅避難情報を発信しています。
            </div>
          </div>
        </div>

        {/* 関連記事 */}
        {related.length > 0 && (
          <section style={{ marginTop: 64 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1A1A1A', fontFamily: 'Kaisei Decol, serif' }}>
              📚 関連記事
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
