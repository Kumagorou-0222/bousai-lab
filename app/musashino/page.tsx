import type { Metadata } from 'next'
import Link from 'next/link'
import MangaDialogue from '@/components/MangaDialogue'
import CtaButton from '@/components/CtaButton'
import Breadcrumb from '@/components/Breadcrumb'
import type { MangaPanel } from '@/lib/articles'

const BASE_URL = 'https://bousai-lab.vercel.app'

export const metadata: Metadata = {
  title: '武蔵野市の防災ガイド｜医師が解説する在宅避難・地震・停電対策',
  description:
    '武蔵野市在住の現役医師が解説する防災ガイド。武蔵野市の地震リスク・在宅避難の考え方・避難所情報を漫画でわかりやすく紹介。今すぐできる備えを確認しよう。',
  alternates: { canonical: `${BASE_URL}/musashino` },
  keywords: ['武蔵野市 防災', '武蔵野市 地震対策', '武蔵野市 避難所', '武蔵野市 在宅避難', '武蔵野市 備え'],
  openGraph: {
    title: '武蔵野市の防災ガイド｜医師が解説する在宅避難・地震・停電対策',
    description: '武蔵野市在住の現役医師が解説する防災ガイド。在宅避難・避難所情報・今すぐできる備えを漫画でわかりやすく紹介。',
    url: `${BASE_URL}/musashino`,
    images: [{ url: `${BASE_URL}/ogp.svg`, width: 1200, height: 630 }],
  },
}

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '武蔵野市の防災ガイド',
  description: '武蔵野市在住の現役医師が解説する防災ガイド',
  url: `${BASE_URL}/musashino`,
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

const introManPanels: MangaPanel[] = [
  { character: 'riss', emotion: 'worried', message: 'ぼくの町・武蔵野市で地震が来たらどうすればいいの？' },
  { character: 'robot', emotion: 'serious', message: '武蔵野市は木造密集地域が少なく火災延焼リスクは比較的低い。ただし揺れは首都直下型地震で震度6弱〜6強が想定される。' },
  { character: 'riss', emotion: 'surprised', message: '避難所に行けば大丈夫？' },
  { character: 'robot', emotion: 'normal', message: '武蔵野市は「在宅避難が基本」だ。自宅が安全なら避難所には行かない。避難所は収容人数に限りがある。' },
]

const ARTICLES = [
  {
    emoji: '🎒',
    title: '防災リュックに本当に必要なもの',
    slug: 'disaster-backpack',
    category: '防災準備',
    excerpt: '水・食料・携帯トイレ・薬・充電器の5品を7kg以内に。',
    panels: [
      { character: 'riss' as const, emotion: 'worried' as const, message: '防災リュックって何を入れればいいの？' },
      { character: 'robot' as const, emotion: 'serious' as const, message: '5つだけ覚えろ。水・食料・携帯トイレ・薬・充電器だ。' },
    ],
  },
  {
    emoji: '🚽',
    title: '携帯トイレの選び方と備蓄量',
    slug: 'emergency-toilet',
    category: '防災準備',
    excerpt: '1人50回分以上。武蔵野市は断水時に携帯トイレが唯一の選択肢。',
    panels: [
      { character: 'riss' as const, emotion: 'worried' as const, message: '携帯トイレって何個準備したらいいの？' },
      { character: 'robot' as const, emotion: 'serious' as const, message: '1人50回分が最低ライン。武蔵野市では断水が20日続く可能性がある。' },
    ],
  },
  {
    emoji: '⚡',
    title: '停電時にやること・やってはいけないこと',
    slug: 'blackout-what-to-do',
    category: '停電対策',
    excerpt: '停電直後は冷蔵庫を開けない、カセットコンロで換気を確保。',
    panels: [
      { character: 'riss' as const, emotion: 'worried' as const, message: '停電したら何をすればいいの？' },
      { character: 'robot' as const, emotion: 'serious' as const, message: 'まず冷蔵庫を閉めっぱなしにしろ。次にモバイルバッテリーを出す。' },
    ],
  },
  {
    emoji: '🏃',
    title: '避難所に持っていくべきもの',
    slug: 'evacuation-items',
    category: '避難',
    excerpt: '処方薬・モバイルバッテリー・携帯トイレは自分で用意する。',
    panels: [
      { character: 'riss' as const, emotion: 'worried' as const, message: '避難所って何を持っていけばいいの？' },
      { character: 'robot' as const, emotion: 'serious' as const, message: '最低5つ。水・食料・薬・衛生用品・充電器だ。武蔵野市の避難所は満杯になる可能性がある。' },
    ],
  },
]

const MUSASHINO_FACTS = [
  { icon: '🏘️', title: '在宅避難が基本', body: '武蔵野市の防災計画では、自宅が安全なら在宅避難が推奨されています。避難所の収容人数は市民全員分ではありません。' },
  { icon: '📍', title: '指定避難所20か所', body: '市内20か所の小中学校・高校が指定避難所です。自分が住む地区の避難所をあらかじめ確認しておきましょう。' },
  { icon: '💧', title: '断水リスク：最大20日', body: '東日本大震災では水道復旧に平均20日かかりました。武蔵野市でも同様のリスクがあります。携帯トイレと保存水が必須です。' },
  { icon: '🌋', title: '想定震度：6弱〜6強', body: '首都直下地震（M7クラス）では、武蔵野市で震度6弱〜6強が想定されています。家具固定が命を守ります。' },
]

const NOW_ACTIONS = [
  { step: 1, icon: '💧', action: '保存水を7日分備蓄する', detail: '1人1日2〜3L × 7日分 = 最低14L' },
  { step: 2, icon: '🚽', action: '携帯トイレを1人50回分準備する', detail: '凝固剤タイプ・防臭袋セットを選ぶ' },
  { step: 3, icon: '📍', action: '最寄り避難所を確認する', detail: '吉祥寺・武蔵境・三鷹の各地区で異なります' },
]

export default function MusashinoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 60px' }}>
        <Breadcrumb items={[{ label: '武蔵野市の防災' }]} />

        {/* ヒーロー */}
        <section style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
          borderRadius: 20,
          padding: '36px 28px',
          marginBottom: 32,
          color: 'white',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, color: '#FFD000', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>
            📍 武蔵野市在住の現役医師が監修
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900, lineHeight: 1.4, margin: '0 0 14px' }}>
            武蔵野市の防災ガイド
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 20px' }}>
            在宅避難・地震対策・停電備え・避難所情報を<br />漫画でわかりやすく解説します
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checklist" style={{
              background: '#FFD000', color: '#1A1A2E',
              borderRadius: 30, padding: '10px 22px',
              textDecoration: 'none', fontSize: 14, fontWeight: 800,
            }}>
              📋 防災チェックリストを確認する
            </Link>
            <Link href="/musashino-bousai" style={{
              background: 'rgba(255,255,255,0.15)', color: 'white',
              borderRadius: 30, padding: '10px 22px',
              textDecoration: 'none', fontSize: 14, fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              🏃 避難所一覧を見る
            </Link>
          </div>
        </section>

        {/* キャラ導入漫画 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(160deg, #FFF9E6, #FFF0D6)', overflow: 'hidden' }}>
                <img src="/img/riss.png" alt="防災リス" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)', overflow: 'hidden' }}>
                <img src="/img/robot.png" alt="レスQロボ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
            武蔵野市の防災を漫画で理解する
          </h2>
          <MangaDialogue panels={introManPanels} />
        </section>

        {/* 武蔵野市の特徴 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px' }}>
            武蔵野市の防災を知る4つのポイント
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {MUSASHINO_FACTS.map((fact) => (
              <div key={fact.title} style={{
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '20px 18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{fact.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', marginBottom: 8 }}>{fact.title}</div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65 }}>{fact.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 今すぐやること */}
        <section style={{
          background: 'linear-gradient(135deg, #FEF2F2, #FFF5F5)',
          border: '2px solid #FECACA',
          borderRadius: 20,
          padding: '28px 24px',
          marginBottom: 40,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#DC2626', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚡ 今すぐやること3つ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {NOW_ACTIONS.map(({ step, icon, action, detail }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#DC2626', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 18, flexShrink: 0,
                }}>
                  {step}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
                    {icon} {action}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 漫画で学ぶ記事一覧 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>
            漫画で学ぶ防災知識
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px', lineHeight: 1.6 }}>
            武蔵野市在住の医師が、防災リスとレスQロボのキャラクターで解説します。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {ARTICLES.map((article) => (
              <div key={article.slug} style={{
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 28 }}>{article.emoji}</span>
                  <div>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>{article.title}</span>
                  </div>
                </div>
                <div style={{ padding: '0 20px' }}>
                  <MangaDialogue
                    panels={article.panels}
                    articleSlug={article.slug}
                    articleTitle={`${article.title}を読む`}
                  />
                </div>
                <div style={{ padding: '4px 20px 16px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                  {article.excerpt}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 避難所情報へのリンク */}
        <section style={{
          background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
          border: '2px solid #BFDBFE',
          borderRadius: 20,
          padding: '28px 24px',
          marginBottom: 40,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📍</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1E40AF', margin: '0 0 10px' }}>
            武蔵野市の避難所一覧・ハザードマップ
          </h2>
          <p style={{ fontSize: 14, color: '#3B5FA0', lineHeight: 1.7, margin: '0 0 20px' }}>
            市内20か所の指定避難所・6か所の広域避難場所を地図で確認できます。<br />
            ハザードマップ・在宅避難チェックリストも掲載。
          </p>
          <Link href="/musashino-bousai" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
            color: 'white',
            borderRadius: 30,
            padding: '12px 28px',
            textDecoration: 'none',
            fontSize: 15,
            fontWeight: 800,
            boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
          }}>
            武蔵野市の詳細防災ガイドを見る →
          </Link>
        </section>

        {/* チェックリストCTA */}
        <section style={{
          background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
          border: '2px solid #BBF7D0',
          borderRadius: 20,
          padding: '28px 24px',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#15803D', margin: '0 0 10px' }}>
            あなたの備えを今すぐチェック
          </h2>
          <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.7, margin: '0 0 20px' }}>
            武蔵野市在住なら特に「携帯トイレ」「保存水」「モバイルバッテリー」の3つを<br />
            今すぐ確認してください。
          </p>
          <CtaButton href="/checklist" text="防災チェックリストを確認する（無料）" />
        </section>

        {/* 著者情報 */}
        <section style={{
          background: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: 20,
          padding: '24px',
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0,
          }}>
            🐻
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 4 }}>監修・著者</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', marginBottom: 6 }}>くまごろう（武蔵野市在住の現役勤務医師）</div>
            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>
              武蔵野市在住の現役医師。災害医療・感染症対策の知識をもとに、地域の実情に合った防災情報を発信しています。
              医療機関での勤務経験から、避難所での健康管理・慢性疾患への対応を特に重視しています。
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
