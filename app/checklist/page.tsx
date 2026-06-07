'use client'

import { useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

type Item = {
  text: string
  href?: string       // おすすめ記事・商品ページへのリンク
  linkLabel?: string  // ボタンテキスト（デフォルト「おすすめを見る」）
}

const CHECKLISTS: {
  id: string
  title: string
  subtitle: string
  color: string
  items: Item[]
}[] = [
  {
    id: 'stock',
    title: '🏠 家庭備蓄チェック',
    subtitle: '自宅に備蓄しておくもの（7日分以上）',
    color: '#2563EB',
    items: [
      { text: '飲料水（1人1日3L × 7日分）', href: '/articles/water-storage-necessary', linkLabel: '備蓄量の計算' },
      { text: '食料（レトルト・缶詰・乾麺 7日分以上）', href: '/best-disaster-items', linkLabel: '非常食おすすめ' },
      { text: '簡易トイレ（凝固剤タイプ）50回分以上', href: '/articles/emergency-toilet', linkLabel: '選び方ガイド' },
      { text: '防臭袋（二重構造タイプ）', href: '/articles/emergency-toilet' },
      { text: 'トイレットペーパー（多めに備蓄）' },
      { text: 'ウェットシート・アルコール消毒液' },
      { text: 'マスク（30枚以上）' },
      { text: '解熱鎮痛薬・整腸薬・胃腸薬' },
      { text: '経口補水液 OS-1（6本以上）' },
      { text: '処方薬の予備（7日分）' },
      { text: 'カセットガスボンベ（12本以上）', href: '/articles/cassette-stove', linkLabel: 'カセットコンロ' },
      { text: '給水タンク・ポリ容器（給水車用）' },
      { text: '使い捨て食器・割り箸・ラップ' },
      { text: '家具の転倒防止（突っ張り棒・L字金具）', href: '/articles/earthquake-furniture', linkLabel: '固定方法ガイド' },
      { text: 'ハザードマップをダウンロード・印刷済み' },
      { text: '家族の避難場所・集合場所を決めてある' },
    ],
  },
  {
    id: 'bag',
    title: '🎒 防災バッグチェック',
    subtitle: '非常持ち出し袋に入れておくもの',
    color: '#DC2626',
    items: [
      { text: '飲料水（500ml × 3本）', href: '/articles/water-storage-necessary' },
      { text: '非常食（カロリーメイト・レトルト 1〜2日分）', href: '/best-disaster-items' },
      { text: '救急セット（絆創膏・ガーゼ・消毒液）' },
      { text: 'お薬手帳のコピー・常備薬（3日分）' },
      { text: 'モバイルバッテリー（充電済み）', href: '/articles/mobile-battery', linkLabel: '容量の選び方' },
      { text: '懐中電灯・乾電池', href: '/articles/blackout-night' },
      { text: '携帯トイレ（5回分以上）', href: '/articles/emergency-toilet' },
      { text: '現金（硬貨含む・1万円以上）' },
      { text: '保険証・マイナンバーカードのコピー' },
      { text: 'マスク・アルコール消毒液' },
      { text: '防寒シート・レインポンチョ' },
      { text: '家族の連絡先メモ（紙に書く）' },
      { text: 'ホイッスル・軍手' },
    ],
  },
  {
    id: 'blackout',
    title: '⚡ 停電対策チェック',
    subtitle: '停電になる前に準備しておくもの',
    color: '#D97706',
    items: [
      { text: 'モバイルバッテリー 20,000mAh以上（充電済み）', href: '/articles/mobile-battery', linkLabel: '容量の選び方' },
      { text: 'LEDランタン・懐中電灯（電池確認済み）', href: '/articles/blackout-night', linkLabel: 'ランタンの選び方' },
      { text: '乾電池（単3・単4 各10本以上）' },
      { text: 'カセットコンロ（動作確認済み）', href: '/articles/cassette-stove', linkLabel: 'コンロの選び方' },
      { text: 'カセットガスボンベ（12本以上）', href: '/articles/cassette-stove' },
      { text: 'ポータブル電源 1,000Wh以上（あれば）', href: '/articles/blackout-longterm', linkLabel: '選び方ガイド' },
      { text: '保冷バッグ・保冷剤（冷蔵庫停止対策）', href: '/articles/blackout-refrigerator' },
      { text: '充電ケーブル各種（Lightning・USB-C）' },
      { text: '手回し・ソーラーラジオ' },
    ],
  },
  {
    id: 'shelter',
    title: '🏃 避難所持ち物チェック',
    subtitle: '避難所に持っていくべきもの',
    color: '#16A34A',
    items: [
      { text: '非常持ち出し袋一式（上記バッグチェック）' },
      { text: '着替え 2〜3日分' },
      { text: '毛布・防寒シート' },
      { text: 'スリッパ・室内履き' },
      { text: '耳栓・アイマスク（避難所は騒がしい）' },
      { text: '携帯トイレ（追加分・10回分以上）', href: '/articles/emergency-toilet' },
      { text: 'ウェットティッシュ・体拭きシート' },
      { text: '生理用品・おむつ（必要な方）' },
      { text: 'ペット用品（キャリー・フード・水）' },
      { text: 'お薬手帳・処方薬（1週間分）' },
      { text: '老眼鏡・コンタクトレンズ用品' },
    ],
  },
]

const PURCHASE_GUIDES: Record<string, { emoji: string; label: string; href: string; desc: string }> = {
  stock: {
    emoji: '🏠',
    label: '家庭備蓄をまとめて揃える',
    href: '/best-disaster-items#cat-toilet',
    desc: 'トイレ・水・食料を優先',
  },
  bag: {
    emoji: '🎒',
    label: '防災バッグの中身を見る',
    href: '/best-disaster-items#cat-shelter',
    desc: '避難所で困りやすいものを確認',
  },
  blackout: {
    emoji: '⚡',
    label: '停電対策グッズを見る',
    href: '/best-disaster-items#cat-blackout',
    desc: '充電・灯り・情報収集を優先',
  },
  shelter: {
    emoji: '🏃',
    label: '避難所グッズを見る',
    href: '/best-disaster-items#cat-shelter',
    desc: '衛生・睡眠・プライバシー対策',
  },
}

const BASE = 'https://bousai-lab.vercel.app'

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<string>('all')

  function toggle(key: string) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function countChecked(id: string) {
    const section = CHECKLISTS.find((c) => c.id === id)
    if (!section) return { done: 0, total: 0 }
    const done = section.items.filter((_, i) => checked[`${id}-${i}`]).length
    return { done, total: section.items.length }
  }

  const allDone = CHECKLISTS.reduce((acc, s) => acc + countChecked(s.id).done, 0)
  const allTotal = CHECKLISTS.reduce((acc, s) => acc + s.items.length, 0)

  const displaySections = activeTab === 'all'
    ? CHECKLISTS
    : CHECKLISTS.filter((c) => c.id === activeTab)

  const missingGuides = CHECKLISTS.flatMap((section) => {
    const guide = PURCHASE_GUIDES[section.id]
    const missing = section.items.filter((_, i) => !checked[`${section.id}-${i}`]).length
    return guide && missing > 0
      ? [{ ...guide, id: section.id, missing, color: section.color }]
      : []
  })

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: '防災チェックリスト' }]} />

      {/* ヘッダー */}
      <div style={{ textAlign: 'center', padding: '36px 0 32px' }}>
        <div style={{ fontSize: 60, marginBottom: 10 }}>📋</div>
        <h1 style={{
          fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 900,
          fontFamily: 'Kaisei Decol, serif', color: '#1A1A1A', marginBottom: 10,
        }}>
          防災チェックリスト
        </h1>
        <p style={{ color: '#666', fontSize: 14, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
          現役医師・くまごろうが監修した防災チェックリスト。<br />
          タップして確認済みにできます。気になる備品は「おすすめを見る」からチェック。
        </p>
      </div>

      {/* 全体進捗バー */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '18px 22px',
        border: '1.5px solid #E2E8F0', marginBottom: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>全体の進捗</span>
          <span style={{ fontWeight: 900, fontSize: 16, color: allDone === allTotal ? '#16A34A' : '#D97706' }}>
            {allDone} / {allTotal}
          </span>
        </div>
        <div style={{ height: 10, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${allTotal === 0 ? 0 : (allDone / allTotal) * 100}%`,
            background: allDone === allTotal ? '#16A34A' : '#FF6B00',
            borderRadius: 999, transition: 'width 0.3s',
          }} />
        </div>
        {allDone === allTotal && allTotal > 0 && (
          <p style={{ textAlign: 'center', marginTop: 10, fontSize: 14, fontWeight: 800, color: '#16A34A' }}>
            🎉 すべて完了！とても安心です
          </p>
        )}
      </div>

      {/* 未チェックから購入導線 */}
      {missingGuides.length > 0 && (
        <div style={{
          background: '#FFF7ED',
          border: '1.5px solid #FED7AA',
          borderRadius: 16,
          padding: '18px 20px',
          marginBottom: 24,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginBottom: 12, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ color: '#EA580C', fontWeight: 900, fontSize: 12, marginBottom: 3 }}>
                未チェックの項目があります
              </div>
              <div style={{ color: '#0F172A', fontWeight: 900, fontSize: 16 }}>
                足りないものだけ、優先して揃える
              </div>
            </div>
            <Link href="/best-disaster-items" style={{
              color: '#EA580C',
              fontWeight: 900,
              fontSize: 12,
              textDecoration: 'none',
            }}>
              グッズ一覧 →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {missingGuides.map((guide) => (
              <Link key={guide.id} href={guide.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'white',
                border: `1px solid ${guide.color}30`,
                borderRadius: 12,
                padding: '12px 14px',
                color: '#0F172A',
                textDecoration: 'none',
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{guide.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 900 }}>{guide.label}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    未チェック {guide.missing}件・{guide.desc}
                  </div>
                </div>
                <span style={{ color: guide.color, fontWeight: 900 }}>›</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* タブ */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
            border: '1.5px solid',
            borderColor: activeTab === 'all' ? '#1A1A1A' : '#CBD5E1',
            background: activeTab === 'all' ? '#1A1A1A' : 'white',
            color: activeTab === 'all' ? 'white' : '#475569',
            fontWeight: 700, fontSize: 13,
          }}
        >
          📋 すべて
        </button>
        {CHECKLISTS.map((s) => {
          const { done, total } = countChecked(s.id)
          return (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              style={{
                padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
                border: '1.5px solid',
                borderColor: activeTab === s.id ? s.color : '#CBD5E1',
                background: activeTab === s.id ? s.color : 'white',
                color: activeTab === s.id ? 'white' : '#475569',
                fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {s.title.split(' ')[0]}
              <span style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 999, fontSize: 11, padding: '1px 6px',
              }}>
                {done}/{total}
              </span>
            </button>
          )
        })}
      </div>

      {/* チェックリスト本体 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {displaySections.map((section) => {
          const { done, total } = countChecked(section.id)
          return (
            <div key={section.id} style={{
              background: 'white', borderRadius: 20,
              border: `1.5px solid ${section.color}28`,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              {/* セクションヘッダー */}
              <div style={{
                background: `${section.color}10`,
                borderBottom: `1.5px solid ${section.color}20`,
                padding: '18px 24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0 }}>{section.title}</h2>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>{section.subtitle}</p>
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 800,
                    color: done === total ? '#16A34A' : section.color,
                    background: done === total ? '#F0FDF4' : `${section.color}15`,
                    borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap',
                  }}>
                    {done}/{total}
                  </div>
                </div>
                <div style={{ height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginTop: 12 }}>
                  <div style={{
                    height: '100%',
                    width: `${total === 0 ? 0 : (done / total) * 100}%`,
                    background: done === total ? '#16A34A' : section.color,
                    borderRadius: 999, transition: 'width 0.3s',
                  }} />
                </div>
              </div>

              {/* アイテムリスト */}
              <ul style={{ listStyle: 'none', padding: '12px 24px 20px', margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {section.items.map((item, j) => {
                  const key = `${section.id}-${j}`
                  const isChecked = checked[key] ?? false
                  const itemText = typeof item === 'string' ? item : item.text
                  const itemHref = typeof item === 'string' ? undefined : item.href
                  const itemLabel = typeof item === 'string' ? undefined : (item.linkLabel ?? 'おすすめを見る')
                  return (
                    <li key={j} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '6px 0',
                      borderBottom: j < section.items.length - 1 ? '1px solid #F1F5F9' : 'none',
                    }}>
                      <label style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        cursor: 'pointer', flex: 1, minWidth: 0,
                      }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(key)}
                          style={{ marginTop: 3, flexShrink: 0, width: 17, height: 17, accentColor: section.color }}
                        />
                        <span style={{
                          fontSize: 14, lineHeight: 1.6,
                          color: isChecked ? '#94A3B8' : '#334155',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}>
                          {itemText}
                        </span>
                      </label>
                      {itemHref && (
                        <Link
                          href={itemHref}
                          className="no-print"
                          style={{
                            flexShrink: 0,
                            fontSize: 11, fontWeight: 700,
                            color: section.color,
                            background: `${section.color}12`,
                            border: `1px solid ${section.color}30`,
                            borderRadius: 6, padding: '3px 8px',
                            textDecoration: 'none', whiteSpace: 'nowrap',
                          }}
                        >
                          {itemLabel} →
                        </Link>
                      )}
                      {/* 印刷時のみURL表示 */}
                      {itemHref && (
                        <span className="print-url" style={{ display: 'none', fontSize: 10, color: '#64748B' }}>
                          {BASE}{itemHref}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {/* PDF保存ボタン */}
      <div style={{
        marginTop: 32,
        background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
        border: '1.5px solid #93C5FD',
        borderRadius: 16, padding: '20px 24px',
        textAlign: 'center',
      }} className="no-print">
        <div style={{ fontSize: 14, fontWeight: 800, color: '#1E40AF', marginBottom: 4 }}>
          📄 このチェックリストをPDFで保存
        </div>
        <div style={{ fontSize: 12, color: '#3B82F6', marginBottom: 14, lineHeight: 1.8 }}>
          印刷→「PDFに保存」で、いつでも確認できるPDFが作れます。<br />
          おすすめ記事へのURLも一緒に印刷されます。
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '12px 28px', borderRadius: 12, cursor: 'pointer',
              border: 'none', background: '#1D4ED8', color: 'white',
              fontWeight: 800, fontSize: 14,
            }}
          >
            📄 PDFで保存 / 印刷する
          </button>
          <button
            onClick={() => setChecked({})}
            style={{
              padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
              border: '1.5px solid #BFDBFE', background: 'white',
              color: '#1D4ED8', fontWeight: 700, fontSize: 13,
            }}
          >
            リセット
          </button>
        </div>
      </div>

      {/* 次のステップ */}
      <div style={{
        marginTop: 32, background: '#F8FAFC', borderRadius: 20,
        border: '1.5px solid #E2E8F0', padding: '24px',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 6, fontFamily: 'Kaisei Decol, serif' }}>
          次のステップ：不足しているものを揃えよう
        </div>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 1.8 }}>
          チェックが入らなかった項目を中心に、優先度の高いものから準備しましょう。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { emoji: '🎒', label: '医師が選ぶ防災グッズ完全版', href: '/best-disaster-items', desc: '優先度・コスパ・選び方を徹底解説' },
            { emoji: '🚽', label: '携帯トイレの選び方・おすすめ', href: '/articles/emergency-toilet', desc: '断水時に絶対必要な50回分備蓄' },
            { emoji: '🔋', label: 'モバイルバッテリーの選び方', href: '/articles/mobile-battery', desc: '20,000mAh以上が防災の基準' },
            { emoji: '🔦', label: 'LEDランタンの選び方', href: '/articles/blackout-night', desc: '乾電池式・200lm以上が目安' },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'white', borderRadius: 12,
              padding: '14px 16px', textDecoration: 'none', color: '#0F172A',
              border: '1px solid #E2E8F0',
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{link.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{link.label}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{link.desc}</div>
              </div>
              <span style={{ color: '#2563EB', fontSize: 18 }}>›</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 印刷スタイル */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-url { display: inline !important; margin-left: 8px; }
          header, nav, footer { display: none !important; }
          body { background: white !important; font-size: 11pt; }
          main { max-width: 100% !important; padding: 0 !important; }
          input[type=checkbox] { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          @page { margin: 15mm; size: A4; }
        }
        @media screen {
          .print-url { display: none; }
        }
      `}</style>
    </div>
  )
}
