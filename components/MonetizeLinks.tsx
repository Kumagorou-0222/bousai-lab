import Link from 'next/link'
import type { MonetizeItem } from '@/lib/articles'
import type { ArticleCategory } from '@/lib/articles'

const DEFAULT_LINKS: Record<ArticleCategory, MonetizeItem[]> = {
  earthquake: [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '今すぐ準備できているか確認しよう' },
    { emoji: '🎒', label: 'おすすめ防災グッズを見る', href: '/best-disaster-items', description: '医師が選んだ優先グッズ一覧' },
    { emoji: '🏚️', label: '地震対策グッズ一覧', href: '/earthquake-items', description: '防災リュック・ヘルメット・家具固定' },
  ],
  typhoon: [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '今すぐ準備できているか確認しよう' },
    { emoji: '🎒', label: 'おすすめ防災グッズを見る', href: '/best-disaster-items', description: '医師が選んだ優先グッズ一覧' },
    { emoji: '🌀', label: '台風対策グッズ一覧', href: '/typhoon-items', description: '保存水・非常食・養生テープ' },
  ],
  blackout: [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '停電対策できているか確認しよう' },
    { emoji: '🎒', label: 'おすすめ防災グッズを見る', href: '/best-disaster-items', description: '医師が選んだ優先グッズ一覧' },
    { emoji: '🔦', label: '停電対策グッズ一覧', href: '/blackout-items', description: 'モバイルバッテリー・ランタン・ポータブル電源' },
  ],
  evacuation: [
    { emoji: '📋', label: '避難持ち物チェックリスト', href: '/checklist', description: '避難所への持ち物を今すぐ確認' },
    { emoji: '🎒', label: 'おすすめ防災グッズを見る', href: '/best-disaster-items', description: '医師が選んだ優先グッズ一覧' },
    { emoji: '🏃', label: '避難・地震対策グッズ', href: '/earthquake-items', description: '非常持ち出し袋・携帯トイレ' },
  ],
  'disaster-prep': [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '今すぐ準備できているか確認しよう' },
    { emoji: '🎒', label: 'おすすめ防災グッズを見る', href: '/best-disaster-items', description: '医師が選んだ防災グッズ完全版' },
  ],
  'heavy-rain': [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '豪雨への備えを今すぐ確認しよう' },
    { emoji: '🔦', label: '懐中電灯を準備する', href: '/best-disaster-items', description: '防水・長寿命LEDタイプを選ぼう' },
    { emoji: '🔋', label: 'モバイルバッテリーを準備する', href: '/best-disaster-items', description: '20,000mAh以上が防災の基準' },
  ],
  flood: [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '浸水への備えを今すぐ確認しよう' },
    { emoji: '🎒', label: '防災リュックを確認する', href: '/best-disaster-items', description: '医師監修の中身リストあり' },
    { emoji: '🔋', label: 'モバイルバッテリーを準備する', href: '/best-disaster-items', description: '20,000mAh以上が防災の基準' },
  ],
  tsunami: [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '津波への備えを今すぐ確認しよう' },
    { emoji: '🎒', label: '防災リュックを確認する', href: '/best-disaster-items', description: '逃げる時間がない場合に備える' },
    { emoji: '🔋', label: 'モバイルバッテリーを準備する', href: '/best-disaster-items', description: '避難先での通信手段を確保' },
  ],
  landslide: [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '土砂災害への備えを確認しよう' },
    { emoji: '🎒', label: '防災リュックを確認する', href: '/best-disaster-items', description: '夜間避難を想定した準備を' },
    { emoji: '🔦', label: 'ヘッドライトを準備する', href: '/best-disaster-items', description: '夜間の避難に両手が使えるタイプ' },
  ],
  volcano: [
    { emoji: '📋', label: '防災チェックリストを確認する', href: '/checklist', description: '降灰への備えを今すぐ確認しよう' },
    { emoji: '😷', label: 'N95マスクを準備する', href: '/best-disaster-items', description: '火山灰には必ずN95以上を使用' },
    { emoji: '🎒', label: '防災リュックを確認する', href: '/best-disaster-items', description: '医師監修の中身リストあり' },
  ],
}

type Props = {
  category: ArticleCategory
  items?: MonetizeItem[]
}

export default function MonetizeLinks({ category, items }: Props) {
  const links = items && items.length > 0 ? items : DEFAULT_LINKS[category] ?? DEFAULT_LINKS['disaster-prep']

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
      border: '1.5px solid #BBF7D0',
      borderRadius: 18,
      padding: '22px 24px',
      marginTop: 40,
      marginBottom: 8,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 800, letterSpacing: '0.06em', marginBottom: 4 }}>
          NEXT STEP
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', fontFamily: 'Kaisei Decol, serif' }}>
          学んだことを、すぐ行動に変えよう
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
          記事を読んだら、次はチェックリストで確認→必要なものを準備
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'white',
              borderRadius: 12,
              padding: '14px 16px',
              textDecoration: 'none',
              border: '1px solid #D1FAE5',
              transition: 'box-shadow 0.15s',
              boxShadow: '0 1px 4px rgba(22,163,74,0.08)',
            }}
          >
            <span style={{
              fontSize: 24, flexShrink: 0,
              width: 42, height: 42,
              background: '#F0FDF4',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {link.emoji}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', marginBottom: 2 }}>
                {link.label}
              </div>
              {link.description && (
                <div style={{ fontSize: 11, color: '#64748B' }}>{link.description}</div>
              )}
            </div>
            <span style={{ color: '#16A34A', fontSize: 20, flexShrink: 0 }}>›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
