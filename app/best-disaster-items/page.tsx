import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'おすすめ防災グッズ完全版【医師監修】',
  description: '医師くまごろうが厳選した防災グッズ7カテゴリ。防災トイレ・モバイルバッテリー・ランタン・非常食・水・保冷バッグ・カセットコンロ。押し売りなしで本当に必要なものだけを解説。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/best-disaster-items' },
}

type Item = {
  name: string
  priority: '必須' | '推奨' | 'あれば便利'
  spec: string
  reason: string
  price: string
  amazonQuery: string
  rakutenQuery: string
  emoji: string
}

const ITEMS: { category: string; emoji: string; color: string; description: string; products: Item[] }[] = [
  {
    category: '携帯トイレ',
    emoji: '🚽',
    color: '#DC2626',
    description: 'マンション・集合住宅では停電・断水時にトイレが使えなくなります。最優先で揃えましょう。',
    products: [
      {
        name: '携帯トイレ（凝固剤タイプ）',
        priority: '必須',
        spec: '50回分以上推奨',
        reason: '断水・停電時はマンションのトイレが使えません。最低50回分、できれば100回分以上を。',
        price: '2,000〜4,000円（50回分）',
        emoji: '🚽',
        amazonQuery: '携帯トイレ+防災+凝固剤+50回',
        rakutenQuery: '携帯トイレ 防災 凝固剤 50回分',
      },
      {
        name: '防臭袋（BOS袋）',
        priority: '必須',
        spec: '二重構造・Sサイズ',
        reason: '使用済み携帯トイレを密封するのに必須。臭いを完全にシャットアウトします。',
        price: '1,000〜2,000円',
        emoji: '🛍️',
        amazonQuery: 'BOS 防臭袋 S 防災',
        rakutenQuery: 'BOS 防臭袋 Sサイズ',
      },
    ],
  },
  {
    category: 'モバイルバッテリー',
    emoji: '🔋',
    color: '#D97706',
    description: '停電時のスマホ充電は情報収集のライフライン。容量と充電速度の両方をチェックしましょう。',
    products: [
      {
        name: 'モバイルバッテリー 大容量',
        priority: '必須',
        spec: '20,000mAh以上・PD対応',
        reason: 'スマートフォンを5〜6回充電できる容量が必要。PD（急速充電）対応が望ましい。',
        price: '3,000〜8,000円',
        emoji: '🔋',
        amazonQuery: 'モバイルバッテリー 20000mAh PD 防災',
        rakutenQuery: 'モバイルバッテリー 20000mAh 大容量',
      },
      {
        name: 'ポータブル電源',
        priority: '推奨',
        spec: '500〜1,000Wh以上',
        reason: '停電が長引く場合に威力を発揮。医療機器使用者・小さい子どもがいる家庭は必須級。',
        price: '30,000〜80,000円',
        emoji: '⚡',
        amazonQuery: 'ポータブル電源 1000Wh 防災',
        rakutenQuery: 'ポータブル電源 1000Wh 大容量',
      },
    ],
  },
  {
    category: 'ランタン・照明',
    emoji: '🔦',
    color: '#2563EB',
    description: '停電時の照明は安全のために必須。LEDで長時間持つものを複数台用意しましょう。',
    products: [
      {
        name: 'LEDランタン',
        priority: '必須',
        spec: '乾電池式・200lm以上',
        reason: '停電時の室内照明に必須。乾電池式で交換できるものが停電時は最も信頼できます。',
        price: '2,000〜5,000円',
        emoji: '🔦',
        amazonQuery: 'LEDランタン 防災 乾電池 キャンプ',
        rakutenQuery: 'LEDランタン 乾電池 防災 明るい',
      },
      {
        name: 'ヘッドライト',
        priority: '推奨',
        spec: '100lm以上・防水',
        reason: '両手が使えるので夜間の避難・作業に便利。懐中電灯と併用を推奨。',
        price: '1,500〜4,000円',
        emoji: '💡',
        amazonQuery: 'ヘッドライト 防災 LED 防水',
        rakutenQuery: 'ヘッドライト LED 防災 防水',
      },
    ],
  },
  {
    category: '非常食',
    emoji: '🍱',
    color: '#16A34A',
    description: '最低7日分の食料備蓄が推奨。加熱不要または水だけで食べられるものを優先しましょう。',
    products: [
      {
        name: 'アルファ米（各種）',
        priority: '必須',
        spec: '水またはお湯で食べられるもの',
        reason: '水を注ぐだけで食べられる。賞味期限5年以上のものが多く、備蓄に最適。',
        price: '200〜400円/食',
        emoji: '🍚',
        amazonQuery: 'アルファ米 非常食 5年保存',
        rakutenQuery: 'アルファ米 非常食 長期保存',
      },
      {
        name: '缶詰・レトルト食品',
        priority: '必須',
        spec: '好みのものを多めに',
        reason: 'そのまま食べられる缶詰（魚・野菜・フルーツ）を中心に、レトルトも混ぜると飽きにくい。',
        price: '500〜1,500円/セット',
        emoji: '🥫',
        amazonQuery: '缶詰 非常食 セット 防災',
        rakutenQuery: '缶詰 防災 セット 長期保存',
      },
    ],
  },
  {
    category: '保存水',
    emoji: '💧',
    color: '#0891B2',
    description: '1人1日2〜3Lが目安。飲料用に加えて調理・衛生用もあわせると安心です。',
    products: [
      {
        name: '長期保存水（5〜10年）',
        priority: '必須',
        spec: '1人×2〜3L×7日分',
        reason: '賞味期限が長く管理しやすい。普通の水でも可だが、備蓄専用を推奨。',
        price: '2,000〜5,000円（2L×6本）',
        emoji: '💧',
        amazonQuery: '保存水 5年 防災 長期',
        rakutenQuery: '保存水 長期 防災 2L',
      },
      {
        name: '給水タンク・ポリ容器',
        priority: '推奨',
        spec: '10〜20L程度',
        reason: '給水車が来た際に受け取るために必要。折りたたみ式が収納しやすい。',
        price: '1,000〜3,000円',
        emoji: '🪣',
        amazonQuery: '給水タンク 防災 折りたたみ 10L',
        rakutenQuery: '給水タンク 折りたたみ 防災',
      },
    ],
  },
  {
    category: '保冷バッグ',
    emoji: '🧊',
    color: '#7C3AED',
    description: '停電時に冷蔵庫の食品を守るため、保冷力の高いバッグと保冷剤をセットで準備しましょう。',
    products: [
      {
        name: '高保冷バッグ（大容量）',
        priority: '推奨',
        spec: '30L以上・保冷力12時間以上',
        reason: '停電時に冷蔵庫の食材を一時的に保管できる。アウトドア用の高保冷タイプが最適。',
        price: '2,000〜8,000円',
        emoji: '🧊',
        amazonQuery: '保冷バッグ 大容量 防災 アウトドア',
        rakutenQuery: '保冷バッグ 30L 大容量 高保冷',
      },
      {
        name: '保冷剤（大型）',
        priority: '推奨',
        spec: '500g以上のもの複数個',
        reason: '保冷バッグと組み合わせて使用。冷凍庫で凍らせておき、停電時に移動させる。',
        price: '500〜2,000円',
        emoji: '🧊',
        amazonQuery: '保冷剤 大型 防災 長持ち',
        rakutenQuery: '保冷剤 大型 長時間',
      },
    ],
  },
  {
    category: 'カセットコンロ',
    emoji: '🔥',
    color: '#EA580C',
    description: '停電時でも調理できる唯一の手段。ガスボンベは多めに備蓄しておきましょう。',
    products: [
      {
        name: 'カセットコンロ',
        priority: '必須',
        spec: '3.0kW以上・CB缶対応',
        reason: '停電・ガス停止時でも調理できる。CB缶（一般的なカセットボンベ）対応を選ぶと調達しやすい。',
        price: '3,000〜8,000円',
        emoji: '🔥',
        amazonQuery: 'カセットコンロ 防災 iwatani',
        rakutenQuery: 'カセットコンロ 防災 備蓄',
      },
      {
        name: 'カセットガスボンベ（12本セット）',
        priority: '必須',
        spec: '12本以上の備蓄を推奨',
        reason: '1本で約60分の使用が目安。7日間の調理を考えると最低12本は必要。',
        price: '1,500〜3,000円（12本）',
        emoji: '⛽',
        amazonQuery: 'カセットボンベ 12本 防災 備蓄',
        rakutenQuery: 'カセットガス 12本セット 防災',
      },
    ],
  },
]

function PriorityBadge({ priority }: { priority: string }) {
  const style: Record<string, { bg: string; color: string }> = {
    '必須':       { bg: '#FEF2F2', color: '#DC2626' },
    '推奨':       { bg: '#FFF7ED', color: '#C2410C' },
    'あれば便利': { bg: '#F0FDF4', color: '#16A34A' },
  }
  const s = style[priority] ?? style['推奨']
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 10, fontWeight: 800, padding: '2px 8px',
      borderRadius: 999, border: `1px solid ${s.color}40`,
    }}>
      {priority}
    </span>
  )
}

export default function BestDisasterItemsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: 'おすすめ防災グッズ' }]} />

      {/* ヘッダー */}
      <div style={{ textAlign: 'center', padding: '36px 0 32px' }}>
        <div style={{ fontSize: 60, marginBottom: 10 }}>🛡️</div>
        <h1 style={{
          fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900,
          fontFamily: 'Kaisei Decol, serif', color: '#1A1A1A', marginBottom: 10,
        }}>
          おすすめ防災グッズ完全版
        </h1>
        <p style={{ color: '#666', fontSize: 14, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
          現役医師・くまごろうが「本当に必要なもの」だけを厳選。<br />
          7カテゴリ・優先度つきで紹介します。
        </p>
      </div>

      {/* 医師からの一言 */}
      <div style={{
        background: '#EFF6FF', border: '1.5px solid #BFDBFE',
        borderRadius: 14, padding: '16px 20px', marginBottom: 32,
        display: 'flex', gap: 14, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>🐻</div>
        <div>
          <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 800, marginBottom: 3 }}>
            くまごろう（現役勤務医師）より
          </div>
          <p style={{ fontSize: 13, color: '#1E3A8A', lineHeight: 1.75, margin: 0 }}>
            防災グッズは「売り込み」ではなく「優先順位」が大事です。まずトイレ・水・照明。
            次に電源・食料。余裕があれば保冷バッグやポータブル電源。この順で揃えてください。
          </p>
        </div>
      </div>

      {/* チェックリストへの誘導 */}
      <Link href="/checklist" style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: '#F0FDF4', border: '1.5px solid #BBF7D0',
        borderRadius: 14, padding: '16px 20px', marginBottom: 32,
        textDecoration: 'none', color: '#0F172A',
      }}>
        <span style={{ fontSize: 28 }}>📋</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
            まず何が足りないか確認する
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            防災チェックリスト → 不足品を把握してから買いに行こう
          </div>
        </div>
        <span style={{ color: '#16A34A', fontSize: 20 }}>›</span>
      </Link>

      {/* カテゴリ別商品 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {ITEMS.map((cat) => (
          <section key={cat.category}>
            {/* カテゴリヘッダー */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${cat.color}18`,
                border: `1.5px solid ${cat.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>
                {cat.emoji}
              </div>
              <div>
                <h2 style={{
                  fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0,
                  fontFamily: 'Kaisei Decol, serif',
                }}>
                  {cat.category}
                </h2>
                <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0' }}>
                  {cat.description}
                </p>
              </div>
            </div>

            {/* 商品カード */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cat.products.map((product, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 16,
                  border: `1.5px solid ${cat.color}20`,
                  padding: '20px 22px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{product.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
                          {product.name}
                        </span>
                        <PriorityBadge priority={product.priority} />
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                        目安スペック：{product.spec}
                      </div>
                    </div>
                  </div>

                  {/* 理由 */}
                  <div style={{
                    background: `${cat.color}08`,
                    borderLeft: `3px solid ${cat.color}`,
                    borderRadius: '0 8px 8px 0',
                    padding: '10px 14px',
                    fontSize: 13, color: '#334155', lineHeight: 1.75,
                    marginBottom: 14,
                  }}>
                    {product.reason}
                  </div>

                  {/* 価格 */}
                  <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
                    💰 価格目安：{product.price}
                  </div>

                  {/* 購入リンク */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a
                      href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(product.amazonQuery)}&tag=bousailab-22`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#FF9900', color: 'white',
                        padding: '9px 18px', borderRadius: 10,
                        textDecoration: 'none', fontWeight: 700, fontSize: 13,
                      }}
                    >
                      🛒 Amazonで見る
                    </a>
                    <a
                      href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(product.rakutenQuery)}/?f=1&RankingId=3&grp=product&scid=af_pc_etc&sc2id=af_103_-1_10000619`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#BF0000', color: 'white',
                        padding: '9px 18px', borderRadius: 10,
                        textDecoration: 'none', fontWeight: 700, fontSize: 13,
                      }}
                    >
                      🛒 楽天で見る
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 免責 */}
      <div style={{
        marginTop: 48, background: '#F8FAFC', borderRadius: 14,
        border: '1px solid #E2E8F0', padding: '16px 20px',
        fontSize: 12, color: '#94A3B8', lineHeight: 1.8,
      }}>
        ※ 本ページのAmazon・楽天リンクはアフィリエイトリンクです。購入価格は変わりません。
        収益はサイト運営・記事作成に使用しています。商品の選定は医師の視点に基づき独立して行っています。
      </div>

      {/* チェックリストへ誘導（末尾） */}
      <div style={{
        marginTop: 40, textAlign: 'center',
        background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
        borderRadius: 20, padding: '32px 24px', color: 'white',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, fontFamily: 'Kaisei Decol, serif' }}>
          まずチェックリストで確認
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 20, lineHeight: 1.8 }}>
          何が足りていないかを確認してから<br />購入するのが一番効率的です
        </p>
        <Link href="/checklist" style={{
          display: 'inline-block',
          background: '#FF6B00', color: 'white',
          padding: '14px 32px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 800, fontSize: 15,
          boxShadow: '0 6px 20px rgba(255,107,0,0.5)',
        }}>
          チェックリストを見る →
        </Link>
      </div>
    </div>
  )
}
