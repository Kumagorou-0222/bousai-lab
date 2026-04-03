import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import CtaButton from '@/components/CtaButton'

const BASE_URL = 'https://bousai-lab.vercel.app'

export const metadata: Metadata = {
  title: '武蔵野市の防災ガイド【在宅避難・避難所・備え】',
  description:
    '武蔵野市の防災ガイド。在宅避難が基本の武蔵野市で、今すぐできる備えのチェックリスト・避難所一覧・ハザードマップの見方を現役医師が解説。',
  alternates: { canonical: `${BASE_URL}/musashino-bousai` },
  openGraph: {
    title: '武蔵野市の防災ガイド【在宅避難・避難所・備え】',
    description: '武蔵野市の在宅避難チェックリスト・避難所一覧・ハザードマップ。現役医師監修。',
    url: `${BASE_URL}/musashino-bousai`,
    images: [{ url: `${BASE_URL}/ogp.svg`, width: 1200, height: 630 }],
  },
}

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '武蔵野市の防災ガイド【在宅避難・避難所・備え】',
  description: '武蔵野市の在宅避難チェックリスト・避難所一覧・ハザードマップ。現役医師監修。',
  author: {
    '@type': 'Person',
    name: 'くまごろう',
    jobTitle: '医師',
    url: `${BASE_URL}/about`,
  },
  publisher: {
    '@type': 'Organization',
    name: '防災Lab',
    url: BASE_URL,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${BASE_URL}/musashino-bousai`,
  },
}

// 武蔵野市の主要避難所（市公式より）
const EVACUATION_SHELTERS = [
  { name: '武蔵野市立第一中学校', address: '吉祥寺北町4-8-1', type: '指定避難所' },
  { name: '武蔵野市立第二中学校', address: '中町4-14-1', type: '指定避難所' },
  { name: '武蔵野市立第三中学校', address: '境南町2-12-1', type: '指定避難所' },
  { name: '武蔵野市立第四中学校', address: '八幡町1-1-1', type: '指定避難所' },
  { name: '武蔵野市立第五中学校', address: '緑町3-1-2', type: '指定避難所' },
  { name: '武蔵野市立井之頭小学校', address: '御殿山1-3-9', type: '指定避難所' },
  { name: '武蔵野市立吉祥寺小学校', address: '吉祥寺南町2-14-1', type: '指定避難所' },
  { name: '武蔵野市立関前南小学校', address: '関前5-7-1', type: '指定避難所' },
  { name: '武蔵野市立桜野小学校', address: '桜堤2-8-1', type: '指定避難所' },
  { name: '武蔵野市立緑小学校', address: '緑町1-5-1', type: '指定避難所' },
]

export default function MusashinoBousaiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 80px' }}>
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: '武蔵野市の防災ガイド' },
        ]} />

        {/* ヘッダー */}
        <div style={{
          background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
          borderRadius: 20, padding: '32px 24px', marginBottom: 32, textAlign: 'center',
        }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📍</div>
          <div style={{
            display: 'inline-block', background: '#FFD000', color: '#1A1A1A',
            fontSize: 12, fontWeight: 700, borderRadius: 20, padding: '4px 14px', marginBottom: 16,
          }}>
            武蔵野市在住の現役医師監修
          </div>
          <h1 style={{
            fontSize: 'clamp(20px, 4.5vw, 28px)', fontWeight: 900,
            lineHeight: 1.4, color: 'white', marginBottom: 10,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            武蔵野市の防災ガイド
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            在宅避難・避難所・ハザードマップ・今すぐできる備え
          </p>
        </div>

        {/* ① 結論：武蔵野市は在宅避難が基本 */}
        <section style={{ marginBottom: 40 }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF6B00, #FF9500)',
            borderRadius: 16, padding: '24px 20px',
          }}>
            <h2 style={{
              color: 'white', fontSize: 18, fontWeight: 900, marginBottom: 12,
              fontFamily: 'Kaisei Decol, serif',
            }}>
              ✅ 結論：武蔵野市は在宅避難が基本
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              武蔵野市は大規模水害・土砂崩れのリスクが比較的低く、耐震性能の高い住宅では
              <strong>自宅にとどまる「在宅避難」が推奨</strong>されています。<br />
              ただし、築年数・建物構造・周辺環境によって異なるため、まず自宅のリスクを確認することが重要です。
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['耐震基準を満たした住宅', '浸水リスクがない地域', '土砂崩れリスクがない地域'].map((item) => (
                <span key={item} style={{
                  background: 'rgba(255,255,255,0.2)', color: 'white',
                  borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
                }}>
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ② 武蔵野市の特徴 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontSize: 20, fontWeight: 900, color: '#1A1A1A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 16,
            paddingBottom: 8, borderBottom: '3px solid #FF6B00',
          }}>
            🏙️ 武蔵野市の災害リスクの特徴
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { emoji: '👥', title: '人口密度が高い', desc: '人口密度は全国でも上位。避難所が混雑する可能性が高く、在宅避難の重要性が増す。' },
              { emoji: '🌊', title: '水害リスクは局所的', desc: '玉川上水・仙川沿いなど一部は浸水リスクあり。ハザードマップで自宅を要確認。' },
              { emoji: '🏠', title: '住宅密集地', desc: '木造密集地域では火災延焼リスクがある。古い木造住宅は耐震補強の検討を。' },
              { emoji: '🚇', title: '交通インフラへの依存', desc: '中央線・井の頭線など鉄道が多く、大規模地震時は帰宅困難者が発生しやすい。' },
            ].map((item) => (
              <div key={item.title} style={{
                background: 'white', borderRadius: 14, padding: '18px 16px',
                border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ③ 在宅避難チェックリスト */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontSize: 20, fontWeight: 900, color: '#1A1A1A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 16,
            paddingBottom: 8, borderBottom: '3px solid #27AE60',
          }}>
            ✅ 在宅避難チェックリスト（今すぐ確認）
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                category: '💧 水', color: '#E3F2FD', border: '#2196F3',
                items: ['飲料水を1人3L×7日分（21L）備蓄している', '浴槽に水を溜める習慣がある（断水に備えた生活用水）', '携帯浄水器 or 浄水タブレットがある'],
              },
              {
                category: '🍱 食料', color: '#FFF3E0', border: '#FF6B00',
                items: ['非常食を7日分以上備蓄している', 'カセットコンロとガスボンベが5本以上ある', 'アレルギー対応食・特別食（子ども・高齢者分）がある'],
              },
              {
                category: '🔋 電源', color: '#F3E5F5', border: '#9C27B0',
                items: ['モバイルバッテリー（大容量）を充電済みで保管している', 'LEDランタン・懐中電灯がある（電池を定期交換）', 'ポータブル電源があれば満充電を維持している'],
              },
              {
                category: '🚽 トイレ', color: '#E8F5E9', border: '#27AE60',
                items: ['携帯トイレを20回分以上備蓄している', '断水時のトイレ使い方を家族で確認している', 'ビニール袋と凝固剤がある'],
              },
            ].map((section) => (
              <div key={section.category} style={{
                background: section.color, borderRadius: 14, padding: '16px',
                border: `2px solid ${section.border}`,
              }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A1A', marginBottom: 10 }}>
                  {section.category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {section.items.map((item) => (
                    <label key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginTop: 2, flexShrink: 0, width: 16, height: 16, accentColor: section.border }} />
                      <span style={{ fontSize: 13, color: '#333', lineHeight: 1.5 }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <CtaButton text="在宅避難に必要な防災グッズを見る" href="/articles/disaster-prep-goods" emoji="🎒" />

        {/* ④ 避難所情報 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontSize: 20, fontWeight: 900, color: '#1A1A1A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 8,
            paddingBottom: 8, borderBottom: '3px solid #4A6FFF',
          }}>
            🏫 武蔵野市の指定避難所（主要10か所）
          </h2>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
            ※最新情報は武蔵野市公式サイトで必ずご確認ください
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {EVACUATION_SHELTERS.map((shelter, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'white', borderRadius: 12, padding: '14px 16px',
                border: '1px solid #E8E8E8',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 28, height: 28, background: '#4A6FFF', color: 'white',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>{shelter.name}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>📍 {shelter.address}</div>
                </div>
                <span style={{
                  background: '#E8F0FF', color: '#4A6FFF',
                  borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {shelter.type}
                </span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16, background: '#FFF8E1', borderRadius: 12,
            padding: '14px 16px', border: '1px solid #FFD000',
          }}>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.7, margin: 0 }}>
              ⚠️ <strong>避難所に行く前に確認</strong><br />
              武蔵野市の全避難所（20か所以上）の最新情報・開設状況は、
              <a href="https://www.city.musashino.lg.jp/bousai_bouhan/bousai/index.html"
                target="_blank" rel="noopener noreferrer"
                style={{ color: '#4A6FFF', fontWeight: 700 }}>
                武蔵野市公式サイト（防災・安全）
              </a>
              でご確認ください。
            </p>
          </div>
        </section>

        {/* ⑤ ハザードマップ */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontSize: 20, fontWeight: 900, color: '#1A1A1A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 16,
            paddingBottom: 8, borderBottom: '3px solid #F5A623',
          }}>
            🗺️ 武蔵野市のハザードマップ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                title: '洪水・浸水ハザードマップ',
                desc: '玉川上水・仙川流域の浸水想定エリアを確認できます。低地にお住まいの方は必ずチェック。',
                color: '#E3F2FD', border: '#2196F3',
                url: 'https://www.city.musashino.lg.jp/bousai_bouhan/bousai/1007748.html',
              },
              {
                title: '土砂災害ハザードマップ',
                desc: '武蔵野市内の土砂災害警戒区域・特別警戒区域を確認できます。',
                color: '#FBE9E7', border: '#FF5722',
                url: 'https://www.city.musashino.lg.jp/bousai_bouhan/bousai/1007748.html',
              },
              {
                title: '地震被害想定マップ',
                desc: '首都直下地震発生時の揺れの強さ・液状化リスクを確認できます。',
                color: '#FFF8E1', border: '#F5A623',
                url: 'https://www.city.musashino.lg.jp/bousai_bouhan/bousai/1007748.html',
              },
            ].map((map) => (
              <a key={map.title} href={map.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: map.color, borderRadius: 14, padding: '16px',
                  border: `2px solid ${map.border}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>
                      🗺️ {map.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{map.desc}</div>
                  </div>
                  <span style={{ color: map.border, fontSize: 20, flexShrink: 0 }}>›</span>
                </div>
              </a>
            ))}
          </div>
          <div style={{
            marginTop: 14, background: '#F8F9FA', borderRadius: 12,
            padding: '14px 16px', border: '1px solid #E0E0E0',
          }}>
            <p style={{ fontSize: 12, color: '#555', lineHeight: 1.8, margin: 0 }}>
              <strong>ハザードマップの見方：</strong><br />
              1. 自宅の住所を地図上で確認する<br />
              2. 色分けされたリスクレベルを確認（濃い色ほど危険）<br />
              3. 最寄りの避難所・避難ルートを確認する<br />
              4. 家族で共有・印刷して保管する
            </p>
          </div>
        </section>

        {/* ⑥ 状況別防災グッズCTA */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontSize: 20, fontWeight: 900, color: '#1A1A1A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 16,
            paddingBottom: 8, borderBottom: '3px solid #27AE60',
          }}>
            🎒 今すぐ準備すべき防災グッズ（状況別）
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                situation: '地震対策',
                emoji: '🏚️', href: '/category/earthquake',
                items: ['非常持ち出し袋', '家具固定グッズ', '防煙マスク'],
                color: '#FF6B00',
              },
              {
                situation: '停電対策',
                emoji: '🔦', href: '/category/blackout',
                items: ['LEDランタン', 'モバイルバッテリー', 'カセットコンロ'],
                color: '#F5A623',
              },
              {
                situation: '台風対策',
                emoji: '🌀', href: '/category/typhoon',
                items: ['養生テープ', '保存水（2Lペット）', '防水テープ'],
                color: '#4A6FFF',
              },
              {
                situation: '在宅避難の長期化',
                emoji: '🏠', href: '/articles/disaster-prep-goods',
                items: ['携帯トイレ', '7日分の非常食', 'ポータブル電源'],
                color: '#27AE60',
              },
            ].map((item) => (
              <Link key={item.situation} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 14, padding: '16px',
                  border: `2px solid ${item.color}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 6 }}>
                      {item.situation}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {item.items.map((g) => (
                        <span key={g} style={{
                          background: `${item.color}18`, color: item.color,
                          borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600,
                        }}>
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span style={{ color: item.color, fontSize: 20, flexShrink: 0 }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CtaButton text="防災グッズの完全リストを見る" href="/articles/disaster-prep-goods" emoji="✅" />

        {/* 著者 */}
        <div style={{
          display: 'flex', gap: 20, alignItems: 'center',
          background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
          borderRadius: 16, padding: 24, marginTop: 40,
        }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #FF6B00, #FFD000)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 28, flexShrink: 0,
          }}>🐻</div>
          <div>
            <div style={{ fontSize: 11, color: '#FF9500', fontWeight: 700 }}>この記事の著者・監修者</div>
            <Link href="/about" style={{ fontWeight: 700, fontSize: 15, color: 'white', textDecoration: 'none' }}>
              くまごろう
            </Link>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginTop: 4 }}>
              🩺 武蔵野市在住・現役勤務医師 ／ 🏢 武蔵野市マンションオーナー<br />
              武蔵野市在住だからこそわかる地域の防災事情を発信。
            </div>
            <Link href="/about" style={{
              fontSize: 12, color: '#FFD000', fontWeight: 600,
              textDecoration: 'none', marginTop: 6, display: 'inline-block',
            }}>
              詳しいプロフィール →
            </Link>
          </div>
        </div>

        {/* 関連カテゴリ */}
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#888', marginBottom: 12 }}>
            災害別の行動ガイド
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link href="/category/earthquake" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid #E0E0E0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#1A1A1A', fontSize: 13, fontWeight: 600 }}>🏚️ 地震が起きたとき</Link>
            <Link href="/category/typhoon" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid #E0E0E0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#1A1A1A', fontSize: 13, fontWeight: 600 }}>🌀 台風が来る前</Link>
            <Link href="/category/blackout" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid #E0E0E0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#1A1A1A', fontSize: 13, fontWeight: 600 }}>🔦 停電したとき</Link>
            <Link href="/category/evacuation" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid #E0E0E0', borderRadius: 50, padding: '8px 16px', textDecoration: 'none', color: '#1A1A1A', fontSize: 13, fontWeight: 600 }}>🏃 避難が必要なとき</Link>
          </div>
        </section>
      </div>
    </>
  )
}
