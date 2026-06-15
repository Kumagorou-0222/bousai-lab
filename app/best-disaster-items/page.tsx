import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { amazonProductUrl, rakutenRoomUrl } from '@/lib/affiliateLinks'

export const metadata: Metadata = {
  title: 'おすすめ防災グッズ完全版【医師監修】',
  description: '医師くまごろうが厳選した防災グッズ12カテゴリ。防災トイレ・モバイルバッテリー・ランタン・非常食・水・保冷バッグ・カセットコンロ。停電対策・避難所・マンション・子供・高齢者別も解説。',
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

type Category = { id: string; category: string; emoji: string; color: string; description: string; products: Item[] }

const ITEMS: Category[] = [
  {
    id: 'toilet',
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
    id: 'battery',
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
    id: 'lantern',
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
    id: 'food',
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
    id: 'water',
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
    id: 'coolbag',
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
    id: 'stove',
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
  // ──────────────────────────────────────────────────
  // シーン別カテゴリ
  // ──────────────────────────────────────────────────
  {
    id: 'blackout',
    category: '停電対策',
    emoji: '⚡',
    color: '#B45309',
    description: '停電は24時間〜数日続くことも。ライフラインが止まっても生活できる準備が必要です。',
    products: [
      {
        name: 'ポータブル電源（大容量）',
        priority: '必須',
        spec: '1,000Wh以上・AC出力あり',
        reason: '冷蔵庫・医療機器・スマホ充電に対応。長期停電には1,000Wh以上が目安。',
        price: '50,000〜120,000円',
        emoji: '⚡',
        amazonQuery: 'ポータブル電源 1000Wh 防災 停電',
        rakutenQuery: 'ポータブル電源 1000Wh 停電 大容量',
      },
      {
        name: 'ソーラーパネル',
        priority: '推奨',
        spec: '100W以上・折りたたみ式',
        reason: 'ポータブル電源を継続充電できる。停電が1週間以上になる場合に力を発揮する。',
        price: '15,000〜40,000円',
        emoji: '☀️',
        amazonQuery: 'ソーラーパネル 折りたたみ 防災 100W',
        rakutenQuery: 'ソーラーパネル 折りたたみ 防災',
      },
      {
        name: '電池式ラジオ（防災ラジオ）',
        priority: '必須',
        spec: 'AM/FM対応・乾電池式',
        reason: '停電中は唯一の情報源になる。スマホの電池を消費せずに情報収集できる。',
        price: '2,000〜6,000円',
        emoji: '📻',
        amazonQuery: '防災ラジオ AM FM 乾電池 防水',
        rakutenQuery: '防災ラジオ 乾電池 手回し AM FM',
      },
    ],
  },
  {
    id: 'shelter',
    category: '避難所',
    emoji: '🏫',
    color: '#0891B2',
    description: '避難所生活は数日〜数週間に及ぶことも。感染症・快適性・衛生に備えましょう。',
    products: [
      {
        name: 'アルコール手指消毒液',
        priority: '必須',
        spec: '60%以上・500ml×2本',
        reason: '避難所での集団感染を防ぐ最重要アイテム。食事前・トイレ後に必ず使う。',
        price: '500〜1,500円',
        emoji: '🧴',
        amazonQuery: 'アルコール消毒液 手指 防災 500ml',
        rakutenQuery: 'アルコール手指消毒液 防災 ウイルス',
      },
      {
        name: '使い捨てマスク（50枚入り）',
        priority: '必須',
        spec: '不織布・50枚以上',
        reason: '飛沫感染・ほこり対策に。避難所での感染症予防に必須の備え。',
        price: '800〜2,000円',
        emoji: '😷',
        amazonQuery: '不織布マスク 50枚 防災 非常用',
        rakutenQuery: '不織布マスク 50枚 大容量 防災',
      },
      {
        name: '簡易プライバシーテント',
        priority: 'あれば便利',
        spec: '着替え・授乳用・1人用',
        reason: '避難所でのプライバシー確保に。着替え・授乳・貴重品管理に使える。',
        price: '3,000〜8,000円',
        emoji: '⛺',
        amazonQuery: '着替えテント 簡易テント 避難所 プライバシー',
        rakutenQuery: '簡易テント 着替え 避難所 プライバシー',
      },
    ],
  },
  {
    id: 'mansion',
    category: 'マンション',
    emoji: '🏢',
    color: '#6D28D9',
    description: 'マンション特有の備え。断水時のトイレ・高層階での生活・エレベーター停止を想定しましょう。',
    products: [
      {
        name: '凝固剤タイプ携帯トイレ（100回分）',
        priority: '必須',
        spec: '100回分・家族人数×15日分',
        reason: 'マンションは断水するとトイレが完全に使えない。100回分以上を確保して。',
        price: '4,000〜8,000円（100回分）',
        emoji: '🚽',
        amazonQuery: '携帯トイレ 100回分 マンション 断水 凝固剤',
        rakutenQuery: '携帯トイレ 100回 マンション 備蓄',
      },
      {
        name: '耐震ラッチ（食器棚・吊り戸棚用）',
        priority: '必須',
        spec: '2〜4個/戸棚',
        reason: '地震で食器棚が開き中身が飛び出す事故を防ぐ。賃貸でも取り付けやすい商品がある。',
        price: '1,000〜3,000円（2個セット）',
        emoji: '🔒',
        amazonQuery: '耐震ラッチ 食器棚 マンション 吊り戸棚',
        rakutenQuery: '耐震ラッチ 食器棚 開き戸',
      },
      {
        name: '耐震マット（家具固定用）',
        priority: '推奨',
        spec: '冷蔵庫・テレビ・本棚に',
        reason: 'マンションでは家具転倒が怪我の主な原因。耐震マットと壁固定を組み合わせる。',
        price: '1,000〜3,000円',
        emoji: '🪵',
        amazonQuery: '耐震マット 家具 冷蔵庫 転倒防止',
        rakutenQuery: '耐震マット 家具固定 防災',
      },
    ],
  },
  {
    id: 'kids',
    category: '子供がいる家庭',
    emoji: '👶',
    color: '#EC4899',
    description: '乳幼児・子供がいる家庭専用の備え。ミルク・おむつ・遊び道具も防災グッズです。',
    products: [
      {
        name: '液体ミルク（常温保存）',
        priority: '必須',
        spec: '乳児がいる家庭は3日分以上',
        reason: '断水・停電でも調乳不要。災害時に赤ちゃんの命をつなぐ最重要備蓄。',
        price: '1,500〜3,000円（6本セット）',
        emoji: '🍼',
        amazonQuery: '液体ミルク 常温 防災 備蓄 乳児',
        rakutenQuery: '液体ミルク 常温 防災 備蓄',
      },
      {
        name: '使い捨ておむつ（多めに備蓄）',
        priority: '必須',
        spec: '3日分以上・サイズは大きめも用意',
        reason: '避難所・在宅避難問わず消耗する。普段より1サイズ大きめも1パック確保を。',
        price: '1,500〜4,000円（1パック）',
        emoji: '👶',
        amazonQuery: 'おむつ 防災 備蓄 大容量 紙おむつ',
        rakutenQuery: 'おむつ 備蓄 防災 大容量',
      },
      {
        name: '使い捨て哺乳瓶（滅菌済み）',
        priority: '推奨',
        spec: '5本以上',
        reason: '断水時は哺乳瓶の消毒が困難。使い捨てタイプなら清潔を保てる。',
        price: '1,000〜2,500円（5本）',
        emoji: '🍼',
        amazonQuery: '哺乳瓶 使い捨て 滅菌済み 防災',
        rakutenQuery: '哺乳瓶 使い捨て 滅菌 防災',
      },
    ],
  },
  {
    id: 'elderly',
    category: '高齢者家庭',
    emoji: '👴',
    color: '#059669',
    description: '高齢者は避難所より在宅避難が推奨。薬・補助具・快適な睡眠環境を重点的に備えましょう。',
    products: [
      {
        name: '常備薬の予備（7日分以上）',
        priority: '必須',
        spec: '処方薬・市販薬合わせて7日分',
        reason: '災害後は薬局・病院が機能しないことがある。お薬手帳のコピーも必ず用意する。',
        price: '定期処方時に余分に確認',
        emoji: '💊',
        amazonQuery: '薬ケース 防災 お薬手帳 携帯',
        rakutenQuery: '薬ケース 防災 お薬手帳',
      },
      {
        name: '折りたたみ杖・歩行補助具',
        priority: '推奨',
        spec: '折りたたみ式・軽量',
        reason: '足腰の弱い方は避難時に転倒しやすい。平時から使い慣れた軽量の杖を1本備える。',
        price: '3,000〜8,000円',
        emoji: '🦯',
        amazonQuery: '折りたたみ杖 軽量 防災 歩行補助',
        rakutenQuery: '折りたたみ杖 軽量 コンパクト',
      },
      {
        name: '非常用簡易マット（断熱）',
        priority: '推奨',
        spec: '保温・断熱・折りたたみ式',
        reason: '体温調節能力が低下しがちな高齢者は、床の冷えや断熱対策が特に重要。',
        price: '2,000〜5,000円',
        emoji: '🛏️',
        amazonQuery: '非常用マット 断熱 保温 防災 アルミ',
        rakutenQuery: '防災マット 断熱 保温 アルミ',
      },
    ],
  },
]

const PICK_GUIDE = [
  {
    type: '最小セット',
    bestFor: '今日まず備えたい人',
    items: '携帯トイレ・保存水・LEDランタン',
    budget: '5,000〜12,000円',
    href: '#cat-toilet',
  },
  {
    type: 'マンション向け',
    bestFor: '断水・エレベーター停止が不安',
    items: '携帯トイレ100回分・保存水・耐震ラッチ',
    budget: '10,000〜20,000円',
    href: '#cat-mansion',
  },
  {
    type: '停電重視',
    bestFor: 'スマホ・冷蔵庫・夜の不安を減らす',
    items: 'モバイルバッテリー・ランタン・防災ラジオ',
    budget: '8,000〜18,000円',
    href: '#cat-battery',
  },
  {
    type: '家族向け',
    bestFor: '子供・高齢者と在宅避難する',
    items: '水7日分・非常食・薬/おむつ/液体ミルク',
    budget: '20,000円〜',
    href: '#cat-kids',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://bousai-lab.vercel.app/' },
            { '@type': 'ListItem', position: 2, name: 'おすすめ防災グッズ', item: 'https://bousai-lab.vercel.app/best-disaster-items' },
          ],
        }) }}
      />
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
          12カテゴリ・優先度つきで紹介します。
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

      {/* 選び方比較 */}
      <section style={{
        background: 'white',
        border: '1.5px solid #E2E8F0',
        borderRadius: 18,
        padding: '20px 22px',
        marginBottom: 32,
        boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
      }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: '#EA580C', fontSize: 12, fontWeight: 900, marginBottom: 4 }}>
            迷ったらここから
          </div>
          <h2 style={{
            color: '#0F172A',
            fontSize: 'clamp(17px, 4vw, 22px)',
            fontWeight: 900,
            margin: 0,
            fontFamily: 'Kaisei Decol, serif',
          }}>
            家庭タイプ別・買う順番
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            minWidth: 620,
            fontSize: 12,
          }}>
            <thead>
              <tr>
                {['タイプ', '向いている人', 'まず買うもの', '予算目安', ''].map((head) => (
                  <th key={head} style={{
                    background: '#F8FAFC',
                    color: '#334155',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderBottom: '1px solid #E2E8F0',
                    fontWeight: 900,
                  }}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PICK_GUIDE.map((row) => (
                <tr key={row.type}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #F1F5F9', fontWeight: 900, color: '#0F172A' }}>
                    {row.type}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #F1F5F9', color: '#475569', lineHeight: 1.5 }}>
                    {row.bestFor}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #F1F5F9', color: '#334155', lineHeight: 1.5 }}>
                    {row.items}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #F1F5F9', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {row.budget}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #F1F5F9', textAlign: 'right' }}>
                    <a href={row.href} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#FF6B00',
                      color: 'white',
                      borderRadius: 10,
                      padding: '8px 12px',
                      textDecoration: 'none',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}>
                      見る →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* カテゴリナビ */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 10, letterSpacing: '0.06em' }}>
          カテゴリジャンプ
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ITEMS.map((cat) => (
            <a
              key={cat.id}
              href={`#cat-${cat.id}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 20,
                background: `${cat.color}12`, border: `1.5px solid ${cat.color}30`,
                color: cat.color, fontSize: 12, fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              {cat.emoji} {cat.category}
            </a>
          ))}
        </div>
      </div>

      {/* カテゴリ別商品 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {ITEMS.map((cat) => (
          <section key={cat.category} id={`cat-${cat.id}`}>
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
                      href={amazonProductUrl(product.amazonQuery)}
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
                      href={rakutenRoomUrl()}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#BF0000', color: 'white',
                        padding: '9px 18px', borderRadius: 10,
                        textDecoration: 'none', fontWeight: 700, fontSize: 13,
                      }}
                    >
                      🛍️ 楽天ROOMで見る
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

