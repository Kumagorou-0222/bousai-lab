import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllSlugs, getArticleBySlug } from '@/lib/articles'
import { campaignUrl } from '@/lib/socialCampaign'

export const metadata: Metadata = { title: 'Instagramからの防災ガイド | 防災Lab' }

export default function InstagramLanding() {
  const articles = getAllSlugs().map((slug) => getArticleBySlug(slug))
    .sort((a, b) => b.date.localeCompare(a.date))
  return <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px' }}>
    <h1>Instagramからの防災ガイド</h1>
    <p>投稿で紹介した備えを、記事で詳しく確認できます。必要なものの選び方も記事内にまとめています。</p>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {articles.map((article) => <li key={article.slug} style={{ padding: '16px 0', borderBottom: '1px solid #ddd' }}>
        <Link href={campaignUrl(article.slug, 'instagram', 'profile')}>{article.title}</Link>
        <p>{article.description}</p>
      </li>)}
    </ul>
  </div>
}
