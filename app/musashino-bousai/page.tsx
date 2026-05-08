import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import CtaButton from '@/components/CtaButton'
import type { MapPin } from '@/components/MusashinoMap'
import MusashinoMapWrapper from '@/components/MusashinoMapWrapper'

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

// 指定避難所（一時集合場所）全20か所
// 出典：武蔵野市公式HP https://www.city.musashino.lg.jp/faq/kurashi_tetsuzuki/bosai/1004409.html
const EVACUATION_SHELTERS: { name: string; address: string; area: string }[] = [
  // 小学校 12校
  { name: '市立第一小学校', address: '吉祥寺本町4-17-16', area: '吉祥寺' },
  { name: '市立第二小学校', address: '境4-2-15', area: '境' },
  { name: '市立第三小学校', address: '吉祥寺南町2-35-9', area: '吉祥寺' },
  { name: '市立第四小学校', address: '吉祥寺北町2-4-5', area: '吉祥寺' },
  { name: '市立第五小学校', address: '関前3-2-20', area: '関前' },
  { name: '市立大野田小学校', address: '吉祥寺北町4-11-37', area: '吉祥寺' },
  { name: '市立境南小学校', address: '境南町2-27-27', area: '境南' },
  { name: '市立本宿小学校', address: '吉祥寺東町4-1-9', area: '吉祥寺東' },
  { name: '市立千川小学校', address: '八幡町3-5-25', area: '八幡' },
  { name: '市立井之頭小学校', address: '吉祥寺本町3-27-19', area: '吉祥寺' },
  { name: '市立関前南小学校', address: '関前3-37-26', area: '関前' },
  { name: '市立桜野小学校', address: '桜堤1-8-19', area: '桜堤' },
  // 中学校 6校
  { name: '市立第一中学校', address: '中町3-9-5', area: '中町' },
  { name: '市立第二中学校', address: '桜堤1-7-31', area: '桜堤' },
  { name: '市立第三中学校', address: '吉祥寺東町1-23-8', area: '吉祥寺東' },
  { name: '市立第四中学校', address: '吉祥寺北町5-11-41', area: '吉祥寺北' },
  { name: '市立第五中学校', address: '関前2-10-20', area: '関前' },
  { name: '市立第六中学校', address: '境3-20-10', area: '境' },
  // 都立高校 2校
  { name: '都立武蔵高校', address: '境4-13-28', area: '境' },
  { name: '都立武蔵野北高校', address: '八幡町2-3-10', area: '八幡' },
]

// 広域避難場所（大規模延焼火災時）
const WIDE_AREA_SHELTERS = [
  { name: 'グリーンパーク', note: '市内最大の広域避難場所' },
  { name: '成蹊学園グラウンド', note: '吉祥寺エリアの広域避難場所' },
  { name: '井の頭恩賜公園', note: '吉祥寺南部・三鷹方面' },
  { name: '小金井公園', note: '境・関前エリア方面' },
  { name: '国際基督教大学（ICU）周辺', note: '桜堤・境南エリア方面' },
  { name: '善福寺公園・東京女子大学一帯', note: '吉祥寺東・関前方面' },
]

// 防災広場（住所付き）
// 出典：https://www.city.musashino.lg.jp/kurashi_tetsuzuki/bosai_anzen/bosai_anzen_center_web/saigai_taisei_hinan/shisetsuseibi/1005955.html
const BOUSAI_HIROBA = [
  { name: '南町防災広場',       address: '吉祥寺南町5-6' },
  { name: '東町防災広場',       address: '吉祥寺東町4-15' },
  { name: '吉祥寺西公園',       address: '吉祥寺本町3-7' },
  { name: '境南町防災広場',     address: '境南町3-20' },
  { name: '西久保二丁目防災広場', address: '西久保2-15' },
  { name: '桜堤二丁目防災広場', address: '桜堤2-8' },
]

// 地図ピンデータ（座標は OpenStreetMap Nominatim を参照）
const MAP_PINS: MapPin[] = [
  // ── いっとき集合場所・避難所（小学校） ──
  { lat: 35.7073, lng: 139.5783, name: '市立第一小学校',   address: '吉祥寺本町4-17-16', type: 'shelter' },
  { lat: 35.7204, lng: 139.5497, name: '市立第二小学校',   address: '境4-2-15',          type: 'shelter' },
  { lat: 35.7028, lng: 139.5769, name: '市立第三小学校',   address: '吉祥寺南町2-35-9',  type: 'shelter' },
  { lat: 35.7185, lng: 139.5726, name: '市立第四小学校',   address: '吉祥寺北町2-4-5',   type: 'shelter' },
  { lat: 35.7166, lng: 139.5622, name: '市立第五小学校',   address: '関前3-2-20',        type: 'shelter' },
  { lat: 35.7218, lng: 139.5763, name: '市立大野田小学校', address: '吉祥寺北町4-11-37', type: 'shelter' },
  { lat: 35.7050, lng: 139.5492, name: '市立境南小学校',   address: '境南町2-27-27',     type: 'shelter' },
  { lat: 35.7076, lng: 139.5847, name: '市立本宿小学校',   address: '吉祥寺東町4-1-9',   type: 'shelter' },
  { lat: 35.7127, lng: 139.5673, name: '市立千川小学校',   address: '八幡町3-5-25',      type: 'shelter' },
  { lat: 35.7063, lng: 139.5742, name: '市立井之頭小学校', address: '吉祥寺本町3-27-19', type: 'shelter' },
  { lat: 35.7161, lng: 139.5582, name: '市立関前南小学校', address: '関前3-37-26',       type: 'shelter' },
  { lat: 35.7093, lng: 139.5417, name: '市立桜野小学校',   address: '桜堤1-8-19',        type: 'shelter' },
  // ── いっとき集合場所・避難所（中学校） ──
  { lat: 35.7056, lng: 139.5702, name: '市立第一中学校',   address: '中町3-9-5',         type: 'shelter' },
  { lat: 35.7090, lng: 139.5414, name: '市立第二中学校',   address: '桜堤1-7-31',        type: 'shelter' },
  { lat: 35.7098, lng: 139.5805, name: '市立第三中学校',   address: '吉祥寺東町1-23-8',  type: 'shelter' },
  { lat: 35.7231, lng: 139.5765, name: '市立第四中学校',   address: '吉祥寺北町5-11-41', type: 'shelter' },
  { lat: 35.7179, lng: 139.5557, name: '市立第五中学校',   address: '関前2-10-20',       type: 'shelter' },
  { lat: 35.7215, lng: 139.5519, name: '市立第六中学校',   address: '境3-20-10',         type: 'shelter' },
  // ── いっとき集合場所・避難所（都立高校） ──
  { lat: 35.7194, lng: 139.5483, name: '都立武蔵高校',     address: '境4-13-28',         type: 'shelter' },
  { lat: 35.7148, lng: 139.5641, name: '都立武蔵野北高校', address: '八幡町2-3-10',      type: 'shelter' },
  // ── 広域避難場所 ──
  { lat: 35.7248, lng: 139.5598, name: 'グリーンパーク',           address: '緑町2丁目周辺',   type: 'wide' },
  { lat: 35.7126, lng: 139.5768, name: '成蹊学園グラウンド',       address: '吉祥寺北町3-3-1', type: 'wide' },
  { lat: 35.6996, lng: 139.5742, name: '井の頭恩賜公園',           address: '御殿山1-18-31',   type: 'wide' },
  { lat: 35.7283, lng: 139.5358, name: '小金井公園',               address: '桜堤1丁目周辺',   type: 'wide' },
  { lat: 35.7072, lng: 139.5283, name: '国際基督教大学（ICU）周辺', address: '境南町6丁目周辺', type: 'wide' },
  { lat: 35.7100, lng: 139.6050, name: '善福寺公園・東京女子大学一帯', address: '関前南側',    type: 'wide' },
  // ── 防災広場 ──
  { lat: 35.7030, lng: 139.5778, name: '南町防災広場',         address: '吉祥寺南町5-6', type: 'hiroba' },
  { lat: 35.7080, lng: 139.5843, name: '東町防災広場',         address: '吉祥寺東町4-15', type: 'hiroba' },
  { lat: 35.7064, lng: 139.5727, name: '吉祥寺西公園',         address: '吉祥寺本町3-7',  type: 'hiroba' },
  { lat: 35.7046, lng: 139.5489, name: '境南町防災広場',       address: '境南町3-20',     type: 'hiroba' },
  { lat: 35.7143, lng: 139.5794, name: '西久保二丁目防災広場', address: '西久保2-15',     type: 'hiroba' },
  { lat: 35.7100, lng: 139.5412, name: '桜堤二丁目防災広場',   address: '桜堤2-8',        type: 'hiroba' },
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
                  マンションオーナーとして痛感するのは、建物の耐震性だけでなく<strong style={{ color: '#0F172A' }}>住民一人ひとりの備えの差が命運を分ける</strong>ということ。このページは、同じ武蔵野市民として、医師として、本当に役立つ情報だけをまとめました。」
                </blockquote>
                <div style={{ marginTop: 10, fontSize: 11, color: '#94A3B8' }}>
                  🩺 武蔵野市在住・現役勤務医師 ／ 🏢 マンションオーナー
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 16 }}>
            {[
              { emoji: '👥', title: '人口密度が高い', desc: '人口密度は全国でも上位。避難所が混雑する可能性が高く、在宅避難の重要性が増す。' },
              { emoji: '🏠', title: '住宅密集地', desc: '木造密集地域では火災延焼リスクがある。古い木造住宅は耐震補強の検討を。' },
              { emoji: '🚇', title: '交通インフラへの依存', desc: '中央線・井の頭線など鉄道が多く、大規模地震時は帰宅困難者が発生しやすい。' },
              { emoji: '🌊', title: '大規模水害リスクは低い', desc: '河川氾濫などの大規模水害リスクは比較的低い。ただし地形的な冠水に注意が必要。' },
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

          {/* 水害リスク詳細：すり鉢状地形 */}
          <div style={{
            background: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderLeft: '4px solid #2563EB',
            borderRadius: 12, padding: '16px 18px',
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1E40AF', marginBottom: 10 }}>
              💧 武蔵野市の水害リスク：「すり鉢状地形」による冠水
            </div>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.85, margin: '0 0 10px' }}>
              武蔵野市は大きな河川がないため、<strong>河川氾濫による大規模水害リスクは低い</strong>のが特徴です。
              しかし、市内の一部エリアは<strong>「すり鉢状の地形」</strong>になっており、
              台風・集中豪雨の際に雨水が集まり、<strong>道路や低地が冠水しやすい場所</strong>があります。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                '大雨のとき、自宅周辺の道路が冠水したことがあるか確認する',
                'ハザードマップで自宅の浸水リスクを確認する',
                '冠水が予想される場合は早めに上階・高台への移動を検討する',
                'アンダーパス（立体交差の低い部分）は冠水しやすいため通行しない',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: '#2563EB', fontWeight: 700, flexShrink: 0 }}>▶</span>
                  <span style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
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
            🏫 武蔵野市の指定避難所（全20か所）
          </h2>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
            市立小学校12校・市立中学校6校・都立高校2校｜※開設状況は武蔵野市公式サイトで確認
          </p>

          {/* エリア説明 */}
          <div style={{
            background: '#EFF6FF', border: '1.5px solid #BFDBFE',
            borderRadius: 10, padding: '11px 14px', marginBottom: 14, fontSize: 12, color: '#1E40AF',
          }}>
            💡 武蔵野市は住所による避難先の指定を行っていません。<strong>お近くの施設に避難</strong>してください。
            <br />ここは「<ruby>いっとき集合場所<rt style={{ fontSize: 9 }}>いっときしゅうごうばしょ</rt></ruby>」兼「避難所」として機能します。
          </div>

          {/* 小学校 */}
          <div style={{ fontWeight: 700, fontSize: 12, color: '#2563EB', marginBottom: 8, letterSpacing: '0.05em' }}>
            ▼ 市立小学校（12校）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
            {EVACUATION_SHELTERS.slice(0, 12).map((shelter, i) => (
              <a
                key={i}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('武蔵野市' + shelter.address)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'white', borderRadius: 10, padding: '10px 14px',
                  border: '1.5px solid #E2E8F0',
                }}>
                  <div style={{
                    width: 24, height: 24, background: '#2563EB', color: 'white',
                    borderRadius: 6, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{shelter.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>📍 {shelter.address}</div>
                  </div>
                  <span style={{
                    background: '#EFF6FF', color: '#2563EB',
                    borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>
                    地図 →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* 中学校 */}
          <div style={{ fontWeight: 700, fontSize: 12, color: '#2563EB', marginBottom: 8, letterSpacing: '0.05em' }}>
            ▼ 市立中学校（6校）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
            {EVACUATION_SHELTERS.slice(12, 18).map((shelter, i) => (
              <a
                key={i}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('武蔵野市' + shelter.address)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'white', borderRadius: 10, padding: '10px 14px',
                  border: '1.5px solid #E2E8F0',
                }}>
                  <div style={{
                    width: 24, height: 24, background: '#1D4ED8', color: 'white',
                    borderRadius: 6, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 13}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{shelter.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>📍 {shelter.address}</div>
                  </div>
                  <span style={{
                    background: '#EFF6FF', color: '#2563EB',
                    borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>
                    地図 →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* 都立高校 */}
          <div style={{ fontWeight: 700, fontSize: 12, color: '#2563EB', marginBottom: 8, letterSpacing: '0.05em' }}>
            ▼ 都立高校（2校）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
            {EVACUATION_SHELTERS.slice(18).map((shelter, i) => (
              <a
                key={i}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('武蔵野市' + shelter.address)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'white', borderRadius: 10, padding: '10px 14px',
                  border: '1.5px solid #E2E8F0',
                }}>
                  <div style={{
                    width: 24, height: 24, background: '#475569', color: 'white',
                    borderRadius: 6, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 19}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{shelter.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>📍 {shelter.address}</div>
                  </div>
                  <span style={{
                    background: '#F1F5F9', color: '#475569',
                    borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>
                    地図 →
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div style={{
            background: '#FFFBEB', borderRadius: 10,
            padding: '12px 14px', border: '1.5px solid #FDE68A',
          }}>
            <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.7, margin: 0 }}>
              ⚠️ <strong>避難所の開設状況は事前に決まっていません。</strong>
              災害発生時の開設情報は
              <a href="https://www.city.musashino.lg.jp/kurashi_tetsuzuki/bosai_anzen/bosai_anzen_center_web/saigai_taisei_hinan/index.html"
                target="_blank" rel="noopener noreferrer"
                style={{ color: '#2563EB', fontWeight: 700 }}>
                武蔵野市公式サイト
              </a>
              ・防災行政無線・武蔵野市防災アプリで確認してください。
            </p>
          </div>
        </section>

        {/* ④-2 一時避難場所（広域避難場所・防災広場） */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 900, color: '#0F172A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 6,
            paddingBottom: 8, borderBottom: '2px solid #DC2626',
          }}>
            🔥 <ruby>広域避難場所<rt style={{ fontSize: 10, fontWeight: 400 }}>こういきひなんばしょ</rt></ruby>・<ruby>防災広場<rt style={{ fontSize: 10, fontWeight: 400 }}>ぼうさいひろば</rt></ruby>
          </h2>
          <div style={{
            background: '#FEF2F2', border: '1.5px solid #FECACA',
            borderLeft: '4px solid #DC2626',
            borderRadius: 10, padding: '12px 14px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.8, margin: 0 }}>
              <strong>大規模な火災延焼が発生したとき</strong>に、炎や熱から身を守るために逃げ込む場所です。
              学校の避難所（<ruby>いっとき集合場所<rt style={{ fontSize: 9 }}>いっときしゅうごうばしょ</rt></ruby>）とは目的が異なります。
            </p>
          </div>

          <div style={{ fontWeight: 700, fontSize: 12, color: '#DC2626', marginBottom: 8, letterSpacing: '0.05em' }}>
            ▼ <ruby>広域避難場所<rt style={{ fontSize: 9, fontWeight: 400 }}>こういきひなんばしょ</rt></ruby>（6か所）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 }}>
            {WIDE_AREA_SHELTERS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'white', borderRadius: 10, padding: '10px 14px',
                border: '1.5px solid #FECACA',
              }}>
                <div style={{
                  width: 24, height: 24, background: '#DC2626', color: 'white',
                  borderRadius: 6, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontWeight: 700, fontSize: 12, color: '#475569', marginBottom: 8, letterSpacing: '0.05em' }}>
            ▼ <ruby>防災広場<rt style={{ fontSize: 9, fontWeight: 400 }}>ぼうさいひろば</rt></ruby>（6か所）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {BOUSAI_HIROBA.map((h, i) => (
              <a
                key={i}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('武蔵野市' + h.address)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'white', borderRadius: 10, padding: '10px 14px',
                  border: '1.5px solid #D1FAE5',
                }}>
                  <div style={{
                    width: 24, height: 24, background: '#16A34A', color: 'white',
                    borderRadius: 6, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, flexShrink: 0,
                  }}>
                    🌳
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>📍 {h.address}</div>
                  </div>
                  <span style={{
                    background: '#F0FDF4', color: '#16A34A',
                    borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>
                    地図 →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ④-3 地図 */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 900, color: '#0F172A',
            fontFamily: 'Kaisei Decol, serif', marginBottom: 8,
            paddingBottom: 8, borderBottom: '2px solid #16A34A',
          }}>
            🗺️ 武蔵野市の避難所マップ
          </h2>

          {/* 凡例 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {[
              { color: '#2563EB', label: 'いっとき集合場所・避難所', emoji: '🏫' },
              { color: '#DC2626', label: '広域避難場所',             emoji: '🌳' },
              { color: '#16A34A', label: '防災広場',                 emoji: '🌿' },
            ].map((l) => (
              <div key={l.label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'white', border: `1.5px solid ${l.color}20`,
                borderRadius: 20, padding: '4px 10px',
                fontSize: 11, fontWeight: 600, color: '#475569',
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: l.color, flexShrink: 0,
                }} />
                {l.emoji} {l.label}
              </div>
            ))}
          </div>

          {/* ピン付きマップ */}
          <div style={{
            border: '1.5px solid #E2E8F0', borderRadius: 14,
            overflow: 'hidden', marginBottom: 12,
          }}>
            <MusashinoMapWrapper pins={MAP_PINS} />
          </div>
          <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 14, lineHeight: 1.6 }}>
            ※ ピンをタップすると施設名・住所・Google マップリンクが表示されます。座標は概算です。正確な情報は市公式マップでご確認ください。
          </p>

          {/* 公式マップリンク */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              href="https://www.city.musashino.lg.jp/_res/projects/default_project/_page_/001/005/950/R7bousaimap.pdf"
              target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>🗺️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'white', marginBottom: 2 }}>
                    武蔵野市 防災情報マップ（公式PDF・印刷用）
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
                    避難所・広域避難場所・防災広場・AED・災害用トイレが全掲載
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>›</span>
              </div>
            </a>
            <a
              href="https://disaportal.gsi.go.jp/hazardmap/maps/index.html?query=%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%AD%A6%E8%94%B5%E9%87%8E%E5%B8%82"
              target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'white', border: '1.5px solid #D1FAE5',
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>🌐</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 2 }}>
                    国土地理院「重ねるハザードマップ」（インタラクティブ）
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    洪水・土砂・地震リスクを地図上で重ね合わせて確認
                  </div>
                </div>
                <span style={{ color: '#16A34A', fontSize: 18 }}>›</span>
              </div>
            </a>
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
                🩺 武蔵野市在住・現役勤務医師 ／ 🏢 マンションオーナー<br />
                武蔵野市在住だからこそわかる地域の防災事情を発信。
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <Link href="/about" style={{
                  fontSize: 12, color: '#2563EB', fontWeight: 700,
                  textDecoration: 'none',
                }}>
                  詳しいプロフィール →
                </Link>
                <a href="https://x.com/zaitaku_bousai" target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 12, color: '#0F172A', fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  𝕏 @zaitaku_bousai →
                </a>
              </div>
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
