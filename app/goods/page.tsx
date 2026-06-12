import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import ProductCard from '@/components/ProductCard'

export const metadata: Metadata = {
  title: '防災グッズおすすめ【在宅避難に必要なものリスト】｜防災Lab',
  description:
    '在宅避難に必要な防災グッズをカテゴリ別に紹介。防災リュック・飲料水・携帯トイレ・モバイルバッテリー・ポータブル電源。まず何を買えばいいかがわかります。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/goods' },
  openGraph: {
    title: '防災グッズおすすめ【在宅避難に必要なものリスト】｜防災Lab',
    description: '防災リュック・飲料水・携帯トイレ・モバイルバッテリー・ポータブル電源。これだけあればまずは安心。',
    url: 'https://bousai-lab.vercel.app/goods',
  },
}

const CATEGORIES = [
  {
    id: 'bag',
    emoji: '🎒',
    label: '防災リュック',
    accent: '#DC2626',
    intro: 'まず1つ用意するならこれ。中身がセットになったものが初心者向け。',
    products: [
      {
        name: '防災リュック（基本セット）',
        price: '参考価格：5,000〜15,000円',
        description: '水・食料・ライト・ラジオなど基本グッズが一式入ったセット。まず1つ用意するならこれ。',
        emoji: '🎒',
        badge: '初心者に最適',
        painText: 'これがないと「何を持って逃げればいいか」がわからない',
        amazonUrl: '防災リュック セット 中身入り',
        rakutenUrl: '防災リュック セット',
        accent: '#DC2626',
      },
    ],
  },
  {
    id: 'water',
    emoji: '💧',
    label: '飲料水',
    accent: '#2563EB',
    intro: '在宅避難の最優先事項。1人1日3L×7日分（21L）が目安。',
    products: [
      {
        name: '長期保存水 2L×6本',
        price: '参考価格：1,500〜3,000円',
        description: '5〜10年保存可能な備蓄用飲料水。1人7日分の備蓄には最低4ケース必要。',
        emoji: '💧',
        badge: '最優先で確保',
        painText: 'これがないと断水時に飲み水がなくなる',
        amazonUrl: '保存水 2L 5年 ケース',
        rakutenUrl: '保存水 長期 防災 2L',
        accent: '#2563EB',
      },
    ],
  },
  {
    id: 'toilet',
    emoji: '🚽',
    label: '携帯トイレ',
    accent: '#16A34A',
    intro: '実際に一番困るのはトイレ。断水時でも使える携帯トイレは必須。',
    products: [
      {
        name: '携帯トイレ（30回分以上）',
        price: '参考価格：2,000〜5,000円',
        description: '断水・下水管被害時に自宅トイレで使える携帯トイレ。凝固剤・消臭袋付きが便利。最低20回分を目安に。',
        emoji: '🚽',
        badge: '盲点になりやすい',
        painText: 'これがないと断水時にトイレが使えなくなる',
        amazonUrl: '携帯トイレ 防災 100回分',
        rakutenUrl: '携帯トイレ 防災',
        accent: '#16A34A',
      },
    ],
  },
  {
    id: 'battery',
    emoji: '🔋',
    label: 'モバイルバッテリー',
    accent: '#7C3AED',
    intro: '情報収集・連絡・ライト代わりに必須。大容量（20,000mAh以上）を選ぶ。',
    products: [
      {
        name: '大容量モバイルバッテリー（20,000mAh以上）',
        price: '参考価格：3,000〜8,000円',
        description: 'スマホを5〜8回充電できる大容量タイプ。ソーラー充電対応モデルが停電時に特に有効。',
        emoji: '🔋',
        badge: '情報収集に必須',
        painText: 'これがないとスマホが切れて情報収集・連絡ができなくなる',
        amazonUrl: 'モバイルバッテリー 20000mAh PSE',
        rakutenUrl: 'モバイルバッテリー 20000mAh 防災',
        accent: '#7C3AED',
      },
    ],
  },
  {
    id: 'power',
    emoji: '⚡',
    label: 'ポータブル電源',
    accent: '#D97706',
    intro: '長期停電に備えるなら必須。家電・医療機器・スマホをまとめて充電できる。',
    products: [
      {
        name: 'ポータブル電源（500Wh以上）',
        price: '参考価格：30,000〜100,000円',
        description: '500Wh以上あれば冷蔵庫・電気毛布・医療機器にも対応できる。停電が長期化した場合の最終手段。',
        emoji: '⚡',
        badge: '長期停電に有効',
        painText: 'これがないと停電が1週間以上続いたとき冷蔵庫・医療機器が使えなくなる',
        amazonUrl: 'ポータブル電源 500Wh AC出力',
        rakutenUrl: 'ポータブル電源 500Wh',
        accent: '#D97706',
      },
    ],
  },
]

export default function GoodsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: '防災グッズおすすめ' },
      ]} />

      {/* ヘッダー */}
      <section style={{
        background: 'linear-gradient(160deg, #0D0D1A, #0A1A3A)',
        borderRadius: 20, padding: '32px 24px', marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,208,0,0.15)', border: '1px solid rgba(255,208,0,0.4)',
          color: '#FFD000', padding: '5px 14px', borderRadius: 50,
          fontWeight: 700, fontSize: 12, marginBottom: 16, letterSpacing: '0.04em',
        }}>
          🎒 在宅避難の備え
        </div>
        <h1 style={{
          color: 'white', fontSize: 'clamp(20px, 5vw, 28px)',
          fontWeight: 900, lineHeight: 1.3, marginBottom: 12,
          fontFamily: 'Kaisei Decol, serif',
        }}>
          防災グッズおすすめ
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, marginBottom: 0 }}>
          これだけあれば、まずは安心です。<br />
          優先順に並べています。まず上から揃えてください。
        </p>
      </section>

      {/* キャラ導入 */}
      <section style={{
        background: '#F0FDF4', border: '1.5px solid #BBF7D0',
        borderRadius: 14, padding: '16px 20px', marginBottom: 28,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.7 }}>
          🐻 <strong>くまごろう：</strong>「備えは"あるかないか"だけじゃなく、<strong>優先順位が大事</strong>だ」
        </div>
        <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.7 }}>
          🐿 <strong>防災リス：</strong>「全部一度に買えないけど、まず何から揃えればいい？」
        </div>
        <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.7 }}>
          🐻 <strong>くまごろう：</strong>「まず<strong>水・トイレ・電源</strong>の順だ。リュックはその後でいい」
        </div>
      </section>

      {/* 優先順位ガイド */}
      <section style={{
        background: '#FFFBEB', border: '1.5px solid #FDE68A',
        borderLeft: '4px solid #D97706',
        borderRadius: 12, padding: '14px 18px', marginBottom: 32,
      }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#78350F', marginBottom: 8 }}>
          💡 揃える優先順位
        </div>
        {['① 飲料水（命に直結）', '② 携帯トイレ（断水時に必須）', '③ モバイルバッテリー（情報収集）', '④ 防災リュック（避難時持ち出し）', '⑤ ポータブル電源（長期停電対策）'].map((item, i) => (
          <div key={i} style={{ fontSize: 12, color: '#92400E', lineHeight: 1.8 }}>
            {item}
          </div>
        ))}
      </section>

      {/* カテゴリ別商品 */}
      {CATEGORIES.map((cat) => (
        <section key={cat.id} style={{ marginBottom: 40 }}>
          <h2 style={{
            fontSize: 17, fontWeight: 900, color: '#0F172A',
            fontFamily: 'Kaisei Decol, serif',
            marginBottom: 6, paddingBottom: 8,
            borderBottom: `2px solid ${cat.accent}`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {cat.emoji} {cat.label}
          </h2>
          <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, marginBottom: 14 }}>
            {cat.intro}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cat.products.map((p, i) => (
              <ProductCard
                key={i}
                name={p.name}
                price={p.price}
                description={p.description}
                emoji={p.emoji}
                badge={p.badge}
                painText={p.painText}
                amazonUrl={p.amazonUrl}
                rakutenUrl={p.rakutenUrl}
                accent={p.accent}
                featured={i === 0}
              />
            ))}
          </div>
        </section>
      ))}

      {/* 監修者 */}
      <section style={{
        background: 'white', border: '1.5px solid #E2E8F0',
        borderRadius: 14, padding: '18px 20px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22, flexShrink: 0,
          }}>🐻</div>
          <div>
            <div style={{ fontSize: 10, color: '#2563EB', fontWeight: 700, marginBottom: 2 }}>監修・選定</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 4 }}>くまごろう（現役勤務医師）</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
              武蔵野市在住・マンションオーナー。医師として・住民として本当に必要なものだけを選定しています。
            </div>
          </div>
        </div>
      </section>

      {/* X導線 */}
      <section style={{ marginBottom: 24 }}>
        <a
          href="https://x.com/zaitaku_bousai"
          target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            border: '1.5px solid #334155',
            borderRadius: 14, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, background: 'black',
              borderRadius: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 900,
              fontSize: 18, flexShrink: 0,
            }}>𝕏</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'white', marginBottom: 3 }}>
                防災ラボ｜在宅避難 @zaitaku_bousai
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                新着グッズ情報・災害速報・実用防災情報を毎日発信
              </div>
            </div>
            <div style={{
              background: 'white', color: '#0F172A',
              borderRadius: 20, padding: '6px 14px',
              fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              フォロー
            </div>
          </div>
        </a>
      </section>

      {/* 関連ページ */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[
          { href: '/category/evacuation', emoji: '🏃', label: '避難ガイド' },
          { href: '/category/blackout', emoji: '🔦', label: '停電対策' },
          { href: '/musashino-bousai', emoji: '📍', label: '武蔵野市の防災' },
          { href: '/articles/disaster-prep-goods', emoji: '✅', label: '備蓄リスト完全版' },
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
      </section>
    </div>
  )
}
