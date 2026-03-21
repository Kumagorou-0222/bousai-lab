import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: '防災チェックリスト',
  description: '在宅避難に必要な準備をチェックリスト形式で確認。食料・水・簡易トイレ・医薬品・情報収集グッズなど医師が監修した防災チェックリストです。',
}

const CHECKLIST = [
  {
    title: '💧 水・食料（7日分以上）',
    items: [
      '飲料水（1人1日2〜3L × 家族人数 × 7日分）',
      '食料（レトルト・缶詰・乾麺・フリーズドライ）',
      '使い捨て食器・ラップ',
      '水のタンク・ポリ容器（給水車用）',
    ],
  },
  {
    title: '🚽 トイレ（マンション最重要）',
    items: [
      '簡易トイレ（凝固剤タイプ）最低50回分',
      '防臭袋（二重構造タイプ）',
      'トイレットペーパー（多めに）',
      'ウェットシート（清潔保持用）',
    ],
  },
  {
    title: '🔋 電源・加熱',
    items: [
      'カセットガスコンロ + ボンベ12本以上',
      'ポータブル電源（1,000Wh以上推奨）',
      'LED懐中電灯・ランタン',
      'モバイルバッテリー（20,000mAh以上）',
      '電池（単3・単4）多めに',
    ],
  },
  {
    title: '💊 医療・衛生（医師監修）',
    items: [
      'お薬手帳 + スマホに写真保存',
      '常備薬・持病の薬（7日分以上の予備）',
      '救急セット（絆創膏・ガーゼ・消毒液）',
      '解熱鎮痛薬・整腸薬',
      '経口補水液（OS-1等）',
      'アルコール手指消毒液（500ml × 2本）',
      'マスク（30枚以上）',
      '体温計',
    ],
  },
  {
    title: '📻 情報収集',
    items: [
      '手回し・ソーラー充電ラジオ',
      'スマートフォン予備充電器・ケーブル',
      '武蔵野市ハザードマップのダウンロード保存',
      '家族の連絡先を紙にも書いておく',
    ],
  },
  {
    title: '🏠 在宅避難の確認',
    items: [
      '自宅の建築年確認（1981年以降か）',
      '浸水ハザードマップで自宅リスク確認',
      '家具の転倒防止対策（突っ張り棒・固定金具）',
      '非常用持ち出し袋の準備（万一の脱出用）',
    ],
  },
]

export default function ChecklistPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 80px' }}>
      <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: '防災チェックリスト' }]} />

      <div style={{ textAlign: 'center', padding: '40px 0 48px' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>📋</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Kaisei Decol, serif', color: '#1A1A1A', marginBottom: 12 }}>
          防災チェックリスト
        </h1>
        <p style={{ color: '#666', fontSize: 14, maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
          現役医師・大家さんが監修した在宅避難チェックリスト。<br />
          クリックして確認済みにできます。
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {CHECKLIST.map((section, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(255,107,0,0.1)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: '#1A1A1A' }}>{section.title}</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.items.map((item, j) => (
                <li key={j}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 14, color: '#444', lineHeight: 1.7 }}>
                    <input type="checkbox" style={{ marginTop: 3, flexShrink: 0, width: 16, height: 16, accentColor: '#FF6B00' }} />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
