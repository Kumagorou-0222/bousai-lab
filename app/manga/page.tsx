import type { Metadata } from 'next'
import Link from 'next/link'
import { MANGA_LIST } from '@/lib/manga'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'マンガで学ぶ防災｜防災Lab',
  description: '地震・停電・避難——レスQロボと防災リスがやさしく教えてくれる防災4コマ漫画。子どもから大人まで楽しく学べます。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/manga' },
  openGraph: {
    title: 'マンガで学ぶ防災｜防災Lab',
    description: 'レスQロボと防災リスが教えてくれる防災4コマ漫画',
    url: 'https://bousai-lab.vercel.app/manga',
  },
}

const CAT_COLOR: Record<string, { bg: string; text: string; badge: string }> = {
  earthquake: { bg: '#FEF2F2', text: '#DC2626', badge: '#DC2626' },
  blackout:   { bg: '#FFFBEB', text: '#D97706', badge: '#D97706' },
  evacuation: { bg: '#F0FDF4', text: '#16A34A', badge: '#16A34A' },
  goods:      { bg: '#FFF7ED', text: '#EA580C', badge: '#EA580C' },
}

const CAT_LABEL: Record<string, string> = {
  earthquake: '地震',
  blackout:   '停電',
  evacuation: '避難',
  goods:      'グッズ',
}

function MangaCard({ manga }: { manga: (typeof MANGA_LIST)[number] }) {
  const catColor = CAT_COLOR[manga.category] ?? CAT_COLOR['earthquake']
  return (
    <Link href={`/manga/${manga.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', borderRadius: 18, border: '2px solid #E2E8F0',
        overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ height: 4, background: catColor.badge }} />
        <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: catColor.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0,
          }}>
            {manga.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-block',
              background: catColor.bg, color: catColor.badge,
              fontSize: 10, fontWeight: 700, borderRadius: 50,
              padding: '2px 10px', marginBottom: 6,
              border: `1px solid ${catColor.badge}40`,
            }}>
              {CAT_LABEL[manga.category] ?? manga.category}
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', lineHeight: 1.4, marginBottom: 4 }}>
              {manga.title}
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{manga.description}</div>
          </div>
          <div style={{
            background: '#1E40AF', color: 'white',
            borderRadius: 8, padding: '8px 12px',
            fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            読む →
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function MangaIndexPage() {
  const learnManga = MANGA_LIST.filter((m) => m.category !== 'goods')
  const goodsManga = MANGA_LIST.filter((m) => m.category === 'goods')

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: 'マンガで学ぶ防災' },
      ]} />

      {/* ヒーロー */}
      <section style={{
        background: 'linear-gradient(160deg, #0D0D1A 0%, #1A1A3A 100%)',
        borderRadius: 20, padding: '32px 20px 28px', marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.45)',
          color: '#818CF8', padding: '5px 14px', borderRadius: 50,
          fontWeight: 700, fontSize: 12, marginBottom: 18,
        }}>
          🎨 4コマ漫画シリーズ
        </div>
        <h1 style={{
          color: 'white', fontSize: 'clamp(22px, 6vw, 34px)',
          fontWeight: 900, lineHeight: 1.3, marginBottom: 12,
          fontFamily: 'Kaisei Decol, serif',
        }}>
          マンガで学ぶ防災
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          <strong style={{ color: '#FFA500' }}>防災リス</strong>が質問して、
          <strong style={{ color: '#60A5FA' }}>レスQロボ</strong>が答える。<br />
          まず漫画で理解して、詳しくは記事で学ぼう。
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,140,0,0.15)', border: '1px solid rgba(255,140,0,0.35)',
            borderRadius: 50, padding: '8px 16px',
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(160deg, #FFF9E6, #FFF0D6)', overflow: 'hidden' }}>
              <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#FFA500', fontWeight: 700, fontSize: 12 }}>防災リス</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>疑問・質問担当</div>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)',
            borderRadius: 50, padding: '8px 16px',
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)', overflow: 'hidden' }}>
              <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#60A5FA', fontWeight: 700, fontSize: 12 }}>レスQロボ</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>結論・解説担当</div>
            </div>
          </div>
        </div>
      </section>

      {/* 📖 防災を学ぶ */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', marginBottom: 16 }}>
          📖 防災を学ぶ（{learnManga.length}作品）
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {learnManga.map((manga) => <MangaCard key={manga.slug} manga={manga} />)}
        </div>
      </section>

      {/* 🛒 グッズを知る */}
      <section style={{ marginBottom: 48 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 8,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', margin: 0 }}>
            🛒 防災グッズを知る（{goodsManga.length}作品）
          </h2>
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
          「なぜ必要か」を漫画で理解してから準備しよう
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {goodsManga.map((manga) => <MangaCard key={manga.slug} manga={manga} />)}
        </div>
      </section>

      {/* 他カテゴリへ */}
      <section style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 14 }}>詳しい防災情報はこちら</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/category/earthquake', label: '🏚️ 地震' },
            { href: '/category/blackout', label: '🔦 停電' },
            { href: '/category/evacuation', label: '🏃 避難' },
            { href: '/best-disaster-items', label: '🛒 防災グッズ一覧' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              background: 'white', border: '1.5px solid #E2E8F0',
              borderRadius: 50, padding: '8px 18px',
              textDecoration: 'none', color: '#475569',
              fontSize: 13, fontWeight: 600,
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
