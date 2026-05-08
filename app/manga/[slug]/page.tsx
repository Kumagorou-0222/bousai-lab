import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MANGA_LIST, getMangaBySlug } from '@/lib/manga'
import Breadcrumb from '@/components/Breadcrumb'

type Props = { params: Promise<{ slug: string }> }

const BASE_URL = 'https://bousai-lab.vercel.app'

const CHAR = {
  riss: {
    img: '/img/riss.png',
    charBg: 'linear-gradient(160deg, #FFF9E6, #FFF0D6)',
    charRadius: '50%',
    charShadow: '0 3px 12px rgba(255,180,0,0.3)',
    bubbleBg: '#FFFBEB',
    bubbleBorder: '#FDE68A',
    textColor: '#92400E',
    fontWeight: '500' as const,
  },
  robot: {
    img: '/img/robot.png',
    charBg: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)',
    charRadius: '10px',
    charShadow: '0 3px 12px rgba(6,182,212,0.3)',
    bubbleBg: '#EFF6FF',
    bubbleBorder: '#BFDBFE',
    textColor: '#1E3A8A',
    fontWeight: '700' as const,
  },
}

const CAT_LABEL: Record<string, string> = {
  earthquake: '地震が起きたとき',
  blackout: '停電したとき',
  evacuation: '避難が必要なとき',
}
const CAT_HREF: Record<string, string> = {
  earthquake: '/category/earthquake',
  blackout: '/category/blackout',
  evacuation: '/category/evacuation',
}

export async function generateStaticParams() {
  return MANGA_LIST.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const manga = getMangaBySlug(slug)
    return {
      title: `${manga.title}【4コマ漫画】｜防災Lab`,
      description: manga.description,
      alternates: { canonical: `${BASE_URL}/manga/${slug}` },
      openGraph: {
        title: `${manga.title}【4コマ漫画】`,
        description: manga.description,
        url: `${BASE_URL}/manga/${slug}`,
      },
    }
  } catch {
    return { title: '漫画が見つかりません' }
  }
}

export default async function MangaPage({ params }: Props) {
  const { slug } = await params
  let manga
  try {
    manga = getMangaBySlug(slug)
  } catch {
    notFound()
  }

  const catLabel = CAT_LABEL[manga.category] ?? manga.category
  const catHref = CAT_HREF[manga.category] ?? '/'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: 'マンガ', href: '/manga' },
        { label: manga.title },
      ]} />

      {/* タイトル */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          display: 'inline-block',
          background: '#EFF6FF', color: '#1E40AF',
          fontSize: 11, fontWeight: 700, borderRadius: 50,
          padding: '4px 14px', marginBottom: 12,
        }}>
          🎨 4コマ漫画｜{catLabel}
        </div>
        <h1 style={{
          fontSize: 'clamp(18px, 5vw, 26px)', fontWeight: 900,
          color: '#0F172A', lineHeight: 1.4,
          fontFamily: 'Kaisei Decol, serif',
        }}>
          {manga.emoji} {manga.title}
        </h1>
      </div>

      {/* 4コマ本体 */}
      <div style={{
        background: 'white',
        borderRadius: 20,
        border: '2px solid #E2E8F0',
        overflow: 'hidden',
        marginBottom: 28,
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              overflow: 'hidden',
            }}>
              <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'rgba(255,255,255,0.15)',
              overflow: 'hidden',
            }}>
              <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>防災リス＆レスQロボ</span>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginLeft: 'auto' }}>4コマ漫画</span>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 3, background: '#CBD5E1', padding: 3,
        }}>
          {manga.panels.map((panel, i) => {
            const char = CHAR[panel.character]
            const isRobot = panel.character === 'robot'
            return (
              <div key={i} style={{
                background: 'white',
                padding: '20px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isRobot ? 'flex-end' : 'flex-start',
                gap: 10,
                minHeight: 180,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 10,
                  left: isRobot ? 'auto' : 10,
                  right: isRobot ? 10 : 'auto',
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#1E40AF', color: 'white',
                  fontSize: 12, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i + 1}
                </div>

                <div style={{
                  width: 60, height: 60, borderRadius: char.charRadius,
                  background: char.charBg,
                  overflow: 'hidden',
                  boxShadow: char.charShadow,
                  marginTop: 14,
                }}>
                  <img src={char.img} alt={panel.character === 'riss' ? '防災リス' : 'レスQロボ'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{
                  background: char.bubbleBg,
                  border: `2px solid ${char.bubbleBorder}`,
                  borderRadius: 12,
                  padding: '10px 12px',
                  fontSize: 13, lineHeight: 1.6,
                  fontWeight: char.fontWeight,
                  color: char.textColor,
                  width: '100%',
                  boxSizing: 'border-box',
                }}>
                  {panel.text}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 要点まとめ */}
      <div style={{
        background: '#F0F9FF',
        borderRadius: 16, padding: '20px 20px', marginBottom: 28,
        border: '2px solid #BFDBFE',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)',
            overflow: 'hidden',
          }}>
            <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#1E3A8A' }}>レスQロボのまとめ</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {manga.points.map((point, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: 'white', borderRadius: 10, padding: '10px 14px',
              border: '1px solid #DBEAFE',
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: '#1E40AF', color: 'white',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <span style={{ fontSize: 14, color: '#1E3A8A', fontWeight: 600 }}>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 記事CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A, #1E3A8A)',
        borderRadius: 16, padding: '24px 20px', marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(160deg, #FFF9E6, #FFF0D6)', overflow: 'hidden' }}>
            <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, lineHeight: '32px' }}>+</span>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)', overflow: 'hidden' }}>
            <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
          もっと詳しく知りたい？<br />
          <strong style={{ color: '#60A5FA' }}>記事で理由・具体策・Q&Aを確認しよう</strong>
        </p>
        <Link href={`/articles/${manga.articleSlug}`} style={{
          display: 'inline-block',
          background: '#3B82F6', color: 'white',
          borderRadius: 12, padding: '14px 28px',
          textDecoration: 'none', fontSize: 15, fontWeight: 700,
          boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
        }}>
          詳しい記事を読む →
        </Link>
      </div>

      {/* 他のマンガ */}
      <section>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
          📚 他のマンガも読む
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MANGA_LIST.filter((m) => m.slug !== manga.slug).map((m) => (
            <Link key={m.slug} href={`/manga/${m.slug}`} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'white', borderRadius: 14, padding: '14px 16px',
              textDecoration: 'none', border: '1.5px solid #E2E8F0',
            }}>
              <span style={{ fontSize: 28 }}>{m.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{m.title}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{m.description}</div>
              </div>
              <span style={{ color: '#2563EB', fontSize: 18 }}>›</span>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <Link href={catHref} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#F8FAFC', border: '1.5px solid #E2E8F0',
          borderRadius: 50, padding: '10px 22px',
          textDecoration: 'none', color: '#475569', fontSize: 13, fontWeight: 600,
        }}>
          {catLabel}の記事一覧を見る →
        </Link>
      </div>
    </div>
  )
}
