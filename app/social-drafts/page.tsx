import type { Metadata } from 'next'
import { getAllSlugs, getArticleBySlug } from '@/lib/articles'
import { socialDrafts } from '@/lib/socialCampaign'

export const metadata: Metadata = { title: 'SNS投稿案 | 防災Lab', robots: { index: false, follow: false } }

export default function SocialDraftsPage() {
  const articles = getAllSlugs().map((slug) => getArticleBySlug(slug))
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20)
  return <div style={{ maxWidth: 760, margin: '40px auto', padding: '0 20px' }}>
    <h1>SNS投稿案</h1>
    <p>内容・画像を確認してから利用してください。ここから自動投稿は行いません。Instagramの導線にはプロフィールに /from/instagram の登録が必要です。</p>
    {articles.map((article) => {
      const drafts = socialDrafts(article)
      return <section key={article.slug} style={{ borderTop: '1px solid #ddd', padding: '20px 0' }}>
        <h2>{article.title}</h2>
        <h3>X</h3><pre style={{ whiteSpace: 'pre-wrap' }}>{drafts.x}</pre>
        <h3>Threads</h3><pre style={{ whiteSpace: 'pre-wrap' }}>{drafts.threads}</pre>
        <h3>Instagram</h3><pre style={{ whiteSpace: 'pre-wrap' }}>{drafts.instagram}</pre>
      </section>
    })}
  </div>
}
