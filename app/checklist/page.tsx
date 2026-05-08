'use client'

import { useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

const CHECKLISTS = [
  {
    id: 'bag',
    title: '🎒 防災バッグチェック',
    subtitle: '非常持ち出し袋に入れておくもの',
    color: '#DC2626',
    items: [
      '飲料水（500ml × 3本）',
      'カロリーメイト・レトルト食品（1〜2日分）',
      '救急セット（絆創膏・ガーゼ・消毒液）',
      'お薬手帳のコピー・常備薬（3日分）',
      'モバイルバッテリー（充電済み）',
      '懐中電灯・乾電池',
      '携帯トイレ（5回分以上）',
      '現金（硬貨含む・1万円以上）',
      '保険証・マイナンバーカードのコピー',
      'マスク（5枚以上）・アルコール消毒液',
      '防寒シート・レインポンチョ',
      '家族の連絡先メモ（紙に書く）',
      'ホイッスル・軍手',
    ],
  },
  {
    id: 'blackout',
    title: '⚡ 停電対策チェック',
    subtitle: '停電になる前に準備しておくもの',
    color: '#D97706',
    items: [
      'モバイルバッテリー 20,000mAh以上（充電済み）',
      'LEDランタン・懐中電灯（電池確認済み）',
      '乾電池（単3・単4 各10本以上）',
      'カセットコンロ（動作確認済み）',
      'カセットガスボンベ（12本以上）',
      'ポータブル電源 1,000Wh以上（あれば）',
      '保冷バッグ・保冷剤（冷蔵庫停止対策）',
      '充電ケーブル各種（Lightning・USB-C）',
      '手回し・ソーラーラジオ',
      'ローソク・マッチ（緊急用のみ）',
      '冷蔵庫の中身を確認・整理してある',
      '夏は熱中症グッズ（扇子・冷感タオル）',
    ],
  },
  {
    id: 'shelter',
    title: '🏃 避難所持ち物チェック',
    subtitle: '避難所に持っていくべきもの',
    color: '#16A34A',
    items: [
      '非常持ち出し袋一式（上記バッグチェック）',
      '着替え 2〜3日分',
      '毛布・スリーピングバッグ（または防寒シート）',
      'スリッパ・室内履き',
      '耳栓・アイマスク（避難所は騒がしい）',
      '携帯トイレ（追加分・10回分以上）',
      'ウェットティッシュ・体拭きシート',
      '生理用品・おむつ（必要な方）',
      'ペット用品（キャリー・フード・水）',
      'スマートフォン・タブレット充電器',
      'お薬手帳・処方薬（1週間分）',
      '医師の診察券・保険証',
      '老眼鏡・コンタクトレンズ用品',
    ],
  },
  {
    id: 'stock',
    title: '🏠 家庭備蓄チェック',
    subtitle: '自宅に備蓄しておくもの（7日分以上）',
    color: '#2563EB',
    items: [
      '飲料水（1人1日2〜3L × 7日分）',
      '食料（レトルト・缶詰・乾麺 7日分以上）',
      '簡易トイレ（凝固剤タイプ）50回分以上',
      '防臭袋（二重構造タイプ）',
      'トイレットペーパー（多めに備蓄）',
      'ティッシュ・ウェットシート',
      'アルコール手指消毒液（500ml × 2本）',
      'マスク（30枚以上）',
      '解熱鎮痛薬・整腸薬・胃腸薬',
      '経口補水液 OS-1（6本以上）',
      'お薬手帳・処方薬の予備（7日分）',
      'カセットガスボンベ（12本以上）',
      '給水タンク・ポリ容器（給水車用）',
      '使い捨て食器・割り箸・ラップ',
      '家具の転倒防止対策（突っ張り棒・L字金具）',
      'ハザードマップをダウンロード・印刷済み',
      '自宅の建築年確認（1981年以降か）',
      '家族の避難場所・集合場所を決めてある',
    ],
  },
]

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
          タップして確認済みにできます。印刷してもお使いいただけます。
        </p>
      </div>

      {/* 全体進捗バー */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '18px 22px',
        border: '1.5px solid #E2E8F0', marginBottom: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
            全体の進捗
          </span>
          <span style={{ fontWeight: 900, fontSize: 16, color: allDone === allTotal ? '#16A34A' : '#D97706' }}>
            {allDone} / {allTotal}
          </span>
        </div>
        <div style={{
          height: 10, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${allTotal === 0 ? 0 : (allDone / allTotal) * 100}%`,
            background: allDone === allTotal ? '#16A34A' : '#FF6B00',
            borderRadius: 999,
            transition: 'width 0.3s',
          }} />
        </div>
        {allDone === allTotal && allTotal > 0 && (
          <p style={{ textAlign: 'center', marginTop: 10, fontSize: 14, fontWeight: 800, color: '#16A34A' }}>
            🎉 すべて完了！とても安心です
          </p>
        )}
      </div>

      {/* タブ */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap',
        marginBottom: 24,
      }}>
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
                background: done === total ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
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
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {section.title}
                    </h2>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>
                      {section.subtitle}
                    </p>
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
                {/* セクション進捗バー */}
                <div style={{
                  height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginTop: 12,
                }}>
                  <div style={{
                    height: '100%',
                    width: `${total === 0 ? 0 : (done / total) * 100}%`,
                    background: done === total ? '#16A34A' : section.color,
                    borderRadius: 999, transition: 'width 0.3s',
                  }} />
                </div>
              </div>

              {/* アイテムリスト */}
              <ul style={{ listStyle: 'none', padding: '12px 24px 20px', margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.items.map((item, j) => {
                  const key = `${section.id}-${j}`
                  const isChecked = checked[key] ?? false
                  return (
                    <li key={j}>
                      <label style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        cursor: 'pointer', fontSize: 14, lineHeight: 1.7,
                        color: isChecked ? '#94A3B8' : '#334155',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        padding: '4px 0',
                      }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(key)}
                          style={{ marginTop: 4, flexShrink: 0, width: 17, height: 17, accentColor: section.color }}
                        />
                        {item}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {/* アクションボタン */}
      <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: '12px 24px', borderRadius: 12, cursor: 'pointer',
            border: '1.5px solid #CBD5E1',
            background: 'white', color: '#334155',
            fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          🖨️ 印刷する
        </button>
        <button
          onClick={() => setChecked({})}
          style={{
            padding: '12px 24px', borderRadius: 12, cursor: 'pointer',
            border: '1.5px solid #FECACA',
            background: 'white', color: '#DC2626',
            fontWeight: 700, fontSize: 14,
          }}
        >
          リセット
        </button>
      </div>

      {/* 導線 */}
      <div style={{
        marginTop: 48, background: '#F8FAFC', borderRadius: 20,
        border: '1.5px solid #E2E8F0', padding: '24px',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 6, fontFamily: 'Kaisei Decol, serif' }}>
          次のステップ：不足しているものを準備しよう
        </div>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 1.8 }}>
          チェックが入らなかった項目を中心に、優先度の高いものから準備しましょう。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { emoji: '🎒', label: 'おすすめ防災グッズ一覧', href: '/best-disaster-items', desc: '医師が選んだ防災グッズ完全版' },
            { emoji: '🏚️', label: '地震対策グッズ', href: '/earthquake-items', desc: '防災リュック・ヘルメット・家具固定' },
            { emoji: '🔦', label: '停電対策グッズ', href: '/blackout-items', desc: 'モバイルバッテリー・ランタン・電源' },
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
          header, nav, button, a[href] { display: none !important; }
          body { background: white !important; }
          input[type=checkbox] { print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
