import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

const BASE_URL = 'https://bousai-lab.vercel.app'

export const metadata: Metadata = {
  title: '武蔵野市の避難所ガイド｜在宅避難・持ち物・学校避難所',
  description:
    '武蔵野市の避難所の考え方、在宅避難との違い、学校避難所の特徴、持ち物をわかりやすく解説。武蔵野市在住の現役医師監修。',
  alternates: { canonical: `${BASE_URL}/musashino/shelters` },
  keywords: ['武蔵野市 避難所', '武蔵野市 学校避難所', '武蔵野市 在宅避難', '武蔵野市 持ち物', '武蔵野市 防災'],
  openGraph: {
    title: '武蔵野市の避難所ガイド｜在宅避難・持ち物・学校避難所',
    description: '武蔵野市の避難所の考え方、在宅避難、持ち物をわかりやすく解説。',
    url: `${BASE_URL}/musashino/shelters`,
    images: [{ url: `${BASE_URL}/ogp.svg`, width: 1200, height: 630 }],
  },
}

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '武蔵野市の避難所ガイド',
  description: '武蔵野市の避難所・在宅避難・持ち物を解説',
  url: `${BASE_URL}/musashino/shelters`,
  author: {
    '@type': 'Person',
    name: 'くまごろう',
    jobTitle: '医師',
    url: `${BASE_URL}/about`,
  },
  about: {
    '@type': 'Place',
    name: '武蔵野市',
    address: { '@type': 'PostalAddress', addressRegion: '東京都', addressLocality: '武蔵野市' },
  },
}

const xPost = {
  short: `【武蔵野市の避難所】\n学校避難所？\n在宅避難？\n👉 状況で選ぶ\n\n#武蔵野市 #防災`,
  normal: `【武蔵野市の避難所】\n\n武蔵野市では\n・学校避難所\n・在宅避難\n両方が重要です。\n\n持ち物や考え方をまとめました👇\n${BASE_URL}/musashino/shelters\n\n#武蔵野市 #防災`,
}

const SHELTER_FEATURES = [
  {
    icon: '🏫',
    title: '学校が避難所になる',
    body: '武蔵野市では市内の小中学校・高校20か所が指定避難所です。自分の地区の避難所を事前に確認しておきましょう。',
  },
  {
    icon: '🏠',
    title: '在宅避難が基本方針',
    body: '武蔵野市の防災計画では「自宅が安全なら在宅避難を推奨」しています。避難所の収容人数は市民全員分ではありません。',
  },
  {
    icon: '🏢',
    title: 'マンション住民への対策',
    body: 'マンション管理組合の自主防災活動が重要です。エレベーター停止・断水への備えを建物ごとに確認しておきましょう。',
  },
]

const ITEMS = [
  { emoji: '💧', name: '飲料水', detail: '1人1日2〜3L × 7日分' },
  { emoji: '🚽', name: '携帯トイレ', detail: '1人50回分以上（凝固剤タイプ）' },
  { emoji: '🔋', name: 'モバイルバッテリー', detail: '20,000mAh以上を充電済みで' },
  { emoji: '🎒', name: '防災リュック', detail: '薬・マスク・着替えを含む' },
]

const RELATED_ARTICLES = [
  { slug: 'evacuation-items', emoji: '🎒', title: '避難所に持っていくべきもの', desc: '処方薬・衛生用品・充電器の優先順位' },
  { slug: 'evacuation-illness', emoji: '🦠', title: '避難所で気をつける病気・感染症対策', desc: 'マスク・手洗い・換気で防げる感染症' },
  { slug: 'disaster-backpack', emoji: '🎒', title: '防災リュックに本当に必要なもの', desc: '7kg以内に収める最適な中身リスト' },
]

export default function MusashinoSheltersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: '武蔵野市の防災', href: '/musashino' },
          { label: '避難所ガイド' },
        ]} />

        {/* ヒーロー */}
        <section style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
          borderRadius: 20, padding: '32px 24px', marginBottom: 28,
          color: 'white', textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#FFD000', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>
            📍 武蔵野市在住の現役医師が監修
          </div>
          <h1 style={{
            fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 900,
            lineHeight: 1.4, margin: '0 0 12px',
            fontFamily: 'Kaisei Decol, serif',
          }}>
            武蔵野市の避難所ガイド
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
            学校避難所・在宅避難・持ち物の考え方を<br />わかりやすく解説します
          </p>
        </section>

        {/* ① キャラ導入 */}
        <section style={{
          background: '#F0FDF4', border: '1.5px solid #BBF7D0',
          borderRadius: 16, padding: '20px 22px', marginBottom: 24,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.75 }}>
            🐿 <strong>防災リス：</strong>「避難所ってどこに行くの？武蔵野市の避難所ってどこ？」
          </div>
          <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.75 }}>
            🤖 <strong>レスQロボ：</strong>「武蔵野市では学校が避難所になることが多い。でもまず<strong>在宅避難が基本</strong>だ。」
          </div>
          <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.75 }}>
            🐿 <strong>防災リス：</strong>「え、避難所に行かなくていいの？」
          </div>
          <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.75 }}>
            🤖 <strong>レスQロボ：</strong>「自宅が安全なら行かないほうがいい。避難所は<strong>収容人数に限りがある</strong>。本当に必要な人のために空けておくべきだ。」
          </div>
        </section>

        {/* ② 避難所とは */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
            🏫 避難所とは何か
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '✅', title: '安全確保の場所', body: '自宅が倒壊・浸水・火災の危険にさらされた人が身を守るための場所です。' },
              { icon: '🕐', title: '一時的な避難拠点', body: '避難所は長期滞在を前提とした施設ではありません。自宅が安全になり次第、帰宅が推奨されます。' },
              { icon: '🏠', title: '在宅避難との違い', body: '自宅が安全に住める状態であれば、在宅避難（自宅にとどまること）のほうが衛生的・精神的に良い場合がほとんどです。感染症リスクも低くなります。' },
            ].map((item) => (
              <div key={item.title} style={{
                background: 'white', border: '1.5px solid #E2E8F0',
                borderRadius: 14, padding: '16px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ③ 武蔵野市の特徴 */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
            📍 武蔵野市の避難所の特徴
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SHELTER_FEATURES.map((f) => (
              <div key={f.title} style={{
                background: 'white', border: '1.5px solid #E2E8F0',
                borderLeft: '4px solid #1E40AF',
                borderRadius: 14, padding: '16px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{f.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 避難所一覧へのリンク */}
          <Link href="/musashino-bousai" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
            border: '1.5px solid #BFDBFE',
            borderRadius: 14, padding: '14px 18px', marginTop: 14,
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: 20 }}>🗺️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF' }}>
                武蔵野市の避難所一覧・ハザードマップを地図で確認する →
              </div>
              <div style={{ fontSize: 11, color: '#3B82F6', marginTop: 2 }}>
                市内20か所の指定避難所・広域避難場所を掲載
              </div>
            </div>
          </Link>
        </section>

        {/* ④ 持ち物 */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
            🎒 避難所に持っていくもの
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 14, lineHeight: 1.6 }}>
            避難所では水・食料・衛生用品を<strong>自分で用意する必要があります</strong>。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 14 }}>
            {ITEMS.map((item) => (
              <div key={item.name} style={{
                background: 'white', border: '1.5px solid #E2E8F0',
                borderRadius: 14, padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>{item.detail}</div>
              </div>
            ))}
          </div>
          <Link href="/articles/evacuation-items" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F0FDF4', border: '1.5px solid #BBF7D0',
            borderRadius: 12, padding: '12px 16px',
            textDecoration: 'none', color: '#15803D',
            fontSize: 13, fontWeight: 700,
          }}>
            <span>📋</span>
            <span style={{ flex: 1 }}>持ち物の完全リストを確認する →</span>
          </Link>
        </section>

        {/* ⑤ 関連記事 */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
            📚 関連記事
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RELATED_ARTICLES.map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'white', border: '1.5px solid #E2E8F0',
                borderRadius: 14, padding: '14px 18px', textDecoration: 'none',
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{a.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', lineHeight: 1.4, marginBottom: 3 }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{a.desc}</div>
                </div>
                <span style={{ color: '#2563EB', fontSize: 18, flexShrink: 0 }}>›</span>
              </Link>
            ))}
          </div>
        </section>

        {/* X投稿生成ボックス */}
        <section style={{
          background: '#F8FAFC', border: '1px solid #E2E8F0',
          borderRadius: 16, padding: '20px 22px', marginBottom: 28,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
            𝕏 X（Twitter）でシェアする
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: '短文版', text: xPost.short },
              { label: '通常版', text: xPost.normal },
            ].map(({ label, text }) => (
              <a
                key={label}
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'black', color: 'white',
                  borderRadius: 10, padding: '10px 16px',
                  textDecoration: 'none', fontSize: 13, fontWeight: 700,
                }}
              >
                <span>𝕏</span>
                <span>{label}でポストする</span>
              </a>
            ))}
          </div>
        </section>

        {/* 著者 */}
        <section style={{
          background: 'white', border: '1.5px solid #E2E8F0',
          borderRadius: 16, padding: '20px 22px',
          display: 'flex', gap: 16, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
          }}>🐻</div>
          <div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, marginBottom: 3 }}>監修・著者</div>
            <Link href="/about" style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', textDecoration: 'none' }}>
              くまごろう
            </Link>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, marginTop: 4 }}>
              🩺 武蔵野市在住・現役勤務医師 ／ 🏢 マンションオーナー<br />
              医師の視点から防災・在宅避難情報を発信。
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
