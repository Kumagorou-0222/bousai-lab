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
          background: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          borderRadius: 18, padding: '28px 24px', marginBottom: 28, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📍</div>
          <div style={{
            display: 'inline-block', background: '#2563EB', color: 'white',
            fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '4px 14px', marginBottom: 14,
          }}>
            武蔵野市在住の現役医師監修
          </div>
          <h1 style={{
            fontSize: 'clamp(20px, 4.5vw, 28px)', fontWeight: 900,
            lineHeight: 1.4, color: '#0F172A', marginBottom: 8,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            武蔵野市の防災ガイド
          </h1>
          <p style={{ color: '#64748B', fontSize: 13 }}>
            在宅避難・避難所・ハザードマップ・今すぐできる備え
          </p>
        </div>

        {/* 武蔵野市在住ならではの視点 */}
        <section style={{ marginBottom: 28 }}>
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1.5px solid #E2E8F0',
            padding: '22px 20px',
            boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 48, height: 48, flexShrink: 0,
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                borderRadius: 12, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 24,
              }}>🐻</div>
              <div>
                <div style={{ fontSize: 10, color: '#2563EB', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em' }}>
                  武蔵野市在住の現役医師・くまごろうの視点
                </div>
                <blockquote style={{
                  margin: 0, padding: 0,
                  fontSize: 13, color: '#475569', lineHeight: 1.85, fontStyle: 'normal',
                }}>
                  「武蔵野市に実際に住んでいて感じるのは、<strong style={{ color: '#0F172A' }}>この街は意外と"静かな脆さ"を持っている</strong>ということです。吉祥寺駅周辺は平時には賑やかですが、大地震が起きれば帰宅困難者があふれ、スーパーは数時間で棚が空になります。<br /><br />
                  マンションオーナーとして複数の物件を管理する中で痛感するのは、建物の耐震性だけでなく<strong style={{ color: '#0F172A' }}>住民一人ひとりの備えの差が命運を分ける</strong>ということ。このページは、同じ武蔵野市民として、医師として、本当に役立つ情報だけをまとめました。」
                </blockquote>
                <div style={{ marginTop: 10, fontSize: 11, color: '#94A3B8' }}>
                  🩺 武蔵野市在住・現役勤務医師 ／ 🏢 武蔵野市マンションオーナー
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ① 結論：武蔵野市は在宅避難が基本 */}
        <section style={{ marginBottom: 36 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
            borderRadius: 14, padding: '22px 20px',
          }}>
            <h2 style={{
              color: 'white', fontSize: 17, fontWeight: 900, marginBottom: 10,
              fontFamily: 'Kaisei Decol, serif',
            }}>
              ✅ 結論：武蔵野市は在宅避難が基本
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>
              武蔵野市は大規模水害・土砂崩れのリスクが比較的低く、耐震性能の高い住宅では
              <strong>自宅にとどまる「在宅避難」が推奨</strong>されています。<br />
              ただし、築年数・建物構造・周辺環境によって異なるため、まず自宅のリスクを確認することが重要です。
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['耐震基準を満たした住宅', '浸水リスクがない地域', '土砂崩れリスクがない地域'].map((item) => (
                <span key={item} style={{
                  background: 'rgba(255,255,255,0.2)', color: 'white',
                  borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600,
                }}>
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ② 武蔵野市の特徴 */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 900, color: '#0F172A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 14,
            paddingBottom: 8, borderBottom: '2px solid #2563EB',
          }}>
            🏙️ 武蔵野市の災害リスクの特徴
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { emoji: '👥', title: '人口密度が高い', desc: '人口密度は全国でも上位。避難所が混雑する可能性が高く、在宅避難の重要性が増す。' },
              { emoji: '🌊', title: '水害リスクは局所的', desc: '玉川上水・仙川沿いなど一部は浸水リスクあり。ハザードマップで自宅を要確認。' },
              { emoji: '🏠', title: '住宅密集地', desc: '木造密集地域では火災延焼リスクがある。古い木造住宅は耐震補強の検討を。' },
              { emoji: '🚇', title: '交通インフラへの依存', desc: '中央線・井の頭線など鉄道が多く、大規模地震時は帰宅困難者が発生しやすい。' },
            ].map((item) => (
              <div key={item.title} style={{
                background: 'white', borderRadius: 12, padding: '16px',
                border: '1.5px solid #E2E8F0', boxShadow: '0 1px 6px rgba(15,23,42,0.05)',
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{item.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ③ 在宅避難チェックリスト */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 900, color: '#0F172A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 14,
            paddingBottom: 8, borderBottom: '2px solid #16A34A',
          }}>
            ✅ 在宅避難チェックリスト（今すぐ確認）
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                category: '💧 水', color: '#EFF6FF', border: '#2563EB', textColor: '#1E40AF',
                items: ['飲料水を1人3L×7日分（21L）備蓄している', '浴槽に水を溜める習慣がある（断水に備えた生活用水）', '携帯浄水器 or 浄水タブレットがある'],
              },
              {
                category: '🍱 食料', color: '#FFFBEB', border: '#D97706', textColor: '#92400E',
                items: ['非常食を7日分以上備蓄している', 'カセットコンロとガスボンベが5本以上ある', 'アレルギー対応食・特別食（子ども・高齢者分）がある'],
              },
              {
                category: '🔋 電源', color: '#F5F3FF', border: '#7C3AED', textColor: '#4C1D95',
                items: ['モバイルバッテリー（大容量）を充電済みで保管している', 'LEDランタン・懐中電灯がある（電池を定期交換）', 'ポータブル電源があれば満充電を維持している'],
              },
              {
                category: '🚽 トイレ', color: '#F0FDF4', border: '#16A34A', textColor: '#14532D',
                items: ['携帯トイレを20回分以上備蓄している', '断水時のトイレ使い方を家族で確認している', 'ビニール袋と凝固剤がある'],
              },
            ].map((section) => (
              <div key={section.category} style={{
                background: section.color, borderRadius: 12, padding: '14px 16px',
                border: `1.5px solid ${section.border}`,
              }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: section.textColor, marginBottom: 10 }}>
                  {section.category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {section.items.map((item) => (
                    <label key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginTop: 2, flexShrink: 0, width: 15, height: 15, accentColor: section.border }} />
                      <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <CtaButton text="在宅避難に必要な防災グッズを見る" href="/articles/disaster-prep-goods" emoji="🎒" />

        {/* ④ 避難所情報 */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 900, color: '#0F172A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 6,
            paddingBottom: 8, borderBottom: '2px solid #2563EB',
          }}>
            🏫 武蔵野市の指定避難所（主要10か所）
          </h2>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
            ※最新情報は武蔵野市公式サイトで必ずご確認ください
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {EVACUATION_SHELTERS.map((shelter, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'white', borderRadius: 10, padding: '12px 14px',
                border: '1.5px solid #E2E8F0',
              }}>
                <div style={{
                  width: 26, height: 26, background: '#2563EB', color: 'white',
                  borderRadius: 8, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{shelter.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>📍 {shelter.address}</div>
                </div>
                <span style={{
                  background: '#EFF6FF', color: '#2563EB',
                  borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}>
                  {shelter.type}
                </span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 12, background: '#FFFBEB', borderRadius: 10,
            padding: '12px 14px', border: '1.5px solid #FDE68A',
          }}>
            <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.7, margin: 0 }}>
              ⚠️ <strong>避難所に行く前に確認</strong><br />
              武蔵野市の全避難所（20か所以上）の最新情報・開設状況は、
              <a href="https://www.city.musashino.lg.jp/bousai_bouhan/bousai/index.html"
                target="_blank" rel="noopener noreferrer"
                style={{ color: '#2563EB', fontWeight: 700 }}>
                武蔵野市公式サイト（防災・安全）
              </a>
              でご確認ください。
            </p>
          </div>
        </section>

        {/* ⑤ ハザードマップ */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 900, color: '#0F172A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 14,
            paddingBottom: 8, borderBottom: '2px solid #D97706',
          }}>
            🗺️ 武蔵野市のハザードマップ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                title: '洪水・浸水ハザードマップ',
                desc: '玉川上水・仙川流域の浸水想定エリアを確認できます。低地にお住まいの方は必ずチェック。',
                color: '#EFF6FF', border: '#2563EB',
                url: 'https://www.city.musashino.lg.jp/bousai_bouhan/bousai/1007748.html',
              },
              {
                title: '土砂災害ハザードマップ',
                desc: '武蔵野市内の土砂災害警戒区域・特別警戒区域を確認できます。',
                color: '#FEF2F2', border: '#DC2626',
                url: 'https://www.city.musashino.lg.jp/bousai_bouhan/bousai/1007748.html',
              },
              {
                title: '地震被害想定マップ',
                desc: '首都直下地震発生時の揺れの強さ・液状化リスクを確認できます。',
                color: '#FFFBEB', border: '#D97706',
                url: 'https://www.city.musashino.lg.jp/bousai_bouhan/bousai/1007748.html',
              },
            ].map((map) => (
              <a key={map.title} href={map.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: map.color, borderRadius: 12, padding: '14px 16px',
                  border: `1.5px solid ${map.border}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 3 }}>
                      🗺️ {map.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{map.desc}</div>
                  </div>
                  <span style={{ color: map.border, fontSize: 20, flexShrink: 0 }}>›</span>
                </div>
              </a>
            ))}
          </div>
          <div style={{
            marginTop: 12, background: '#F8FAFC', borderRadius: 10,
            padding: '12px 14px', border: '1px solid #E2E8F0',
          }}>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.8, margin: 0 }}>
              <strong>ハザードマップの見方：</strong><br />
              1. 自宅の住所を地図上で確認する<br />
              2. 色分けされたリスクレベルを確認（濃い色ほど危険）<br />
              3. 最寄りの避難所・避難ルートを確認する<br />
              4. 家族で共有・印刷して保管する
            </p>
          </div>
        </section>

        {/* ⑥ 状況別防災グッズCTA */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 900, color: '#0F172A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 14,
            paddingBottom: 8, borderBottom: '2px solid #16A34A',
          }}>
            🎒 今すぐ準備すべき防災グッズ（状況別）
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              {
                situation: '地震対策',
                emoji: '🏚️', href: '/category/earthquake',
                items: ['非常持ち出し袋', '家具固定グッズ', '防煙マスク'],
                color: '#DC2626', bg: '#FEF2F2',
              },
              {
                situation: '停電対策',
                emoji: '🔦', href: '/category/blackout',
                items: ['LEDランタン', 'モバイルバッテリー', 'カセットコンロ'],
                color: '#D97706', bg: '#FFFBEB',
              },
              {
                situation: '台風対策',
                emoji: '🌀', href: '/category/typhoon',
                items: ['養生テープ', '保存水（2Lペット）', '防水テープ'],
                color: '#2563EB', bg: '#EFF6FF',
              },
              {
                situation: '在宅避難の長期化',
                emoji: '🏠', href: '/articles/disaster-prep-goods',
                items: ['携帯トイレ', '7日分の非常食', 'ポータブル電源'],
                color: '#16A34A', bg: '#F0FDF4',
              },
            ].map((item) => (
              <Link key={item.situation} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 12, padding: '14px 16px',
                  border: `1.5px solid ${item.color}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 40, height: 40, background: item.bg,
                    borderRadius: 10, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 20, flexShrink: 0,
                  }}>
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 5 }}>
                      {item.situation}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {item.items.map((g) => (
                        <span key={g} style={{
                          background: item.bg, color: item.color,
                          borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600,
                        }}>
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span style={{ color: item.color, fontSize: 18, flexShrink: 0 }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CtaButton text="防災グッズの完全リストを見る" href="/articles/disaster-prep-goods" emoji="✅" />

        {/* 著者 */}
        <div style={{
          background: 'white', border: '1.5px solid #E2E8F0',
          borderRadius: 16, padding: 22, marginTop: 40,
          boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 50, height: 50,
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 24, flexShrink: 0,
            }}>🐻</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#2563EB', fontWeight: 700, marginBottom: 3 }}>この記事の著者・監修者</div>
              <Link href="/about" style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', textDecoration: 'none' }}>
                くまごろう
              </Link>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, marginTop: 3 }}>
                🩺 武蔵野市在住・現役勤務医師 ／ 🏢 武蔵野市マンションオーナー<br />
                武蔵野市在住だからこそわかる地域の防災事情を発信。
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

        {/* 関連カテゴリ */}
        <section style={{ marginTop: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: 10 }}>
            災害別の行動ガイド
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { href: '/category/earthquake', label: '地震が起きたとき', emoji: '🏚️' },
              { href: '/category/typhoon', label: '台風が来る前', emoji: '🌀' },
              { href: '/category/blackout', label: '停電したとき', emoji: '🔦' },
              { href: '/category/evacuation', label: '避難が必要なとき', emoji: '🏃' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1.5px solid #E2E8F0',
                borderRadius: 50, padding: '8px 16px',
                textDecoration: 'none', color: '#475569',
                fontSize: 12, fontWeight: 600,
              }}>
                {item.emoji} {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
