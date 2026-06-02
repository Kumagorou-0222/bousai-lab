import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '防災Labへのお問い合わせページです。記事の内容・サイトに関するご意見・ご要望はこちらからどうぞ。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/contact' },
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: 'お問い合わせ' }]} />

      <div style={{ padding: '20px 0 32px' }}>
        <h1 style={{
          fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 900,
          color: '#0F172A', fontFamily: 'Kaisei Decol, serif',
          marginBottom: 8, lineHeight: 1.3,
        }}>
          お問い合わせ
        </h1>
        <p style={{ fontSize: 13, color: '#94A3B8' }}>
          記事の内容・サイトに関するご意見・ご要望をお寄せください
        </p>
      </div>

      {/* 注意書き */}
      <div style={{
        background: '#FFF7ED', border: '1.5px solid #FED7AA',
        borderLeft: '4px solid #F59E0B',
        borderRadius: 12, padding: '14px 18px',
        marginBottom: 32, fontSize: 13, color: '#92400E', lineHeight: 1.7,
      }}>
        <strong>⚠️ ご注意：</strong>
        緊急時の防災情報については、気象庁・市区町村の公式サイトをご参照ください。
        個別の医療相談にはお答えできません。
      </div>

      {/* お問い合わせカード */}
      <div style={{
        background: 'white', border: '1.5px solid #E2E8F0',
        borderRadius: 16, padding: '32px 28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginBottom: 32,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: '#EFF6FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, flexShrink: 0,
          }}>
            ✉️
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A', marginBottom: 4 }}>
              メールでのお問い合わせ
            </div>
            <div style={{ fontSize: 13, color: '#64748B' }}>
              通常2〜3営業日以内にご返信します
            </div>
          </div>
        </div>

        <a
          href="mailto:kensuke0222@gmail.com?subject=%E9%98%B2%E7%81%BDLab%E3%81%B8%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#2563EB', color: 'white',
            borderRadius: 12, padding: '16px 32px',
            textDecoration: 'none', fontSize: 15, fontWeight: 700,
            boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
          }}
        >
          ✉️ メールを送る
        </a>

        <p style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 14 }}>
          kensuke0222@gmail.com
        </p>
      </div>

      {/* 対応内容 */}
      <div style={{
        background: '#F8FAFC', border: '1px solid #E2E8F0',
        borderRadius: 14, padding: '24px 22px',
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>
          📋 お問い合わせいただける内容
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { emoji: '📝', text: '記事の内容に関するご意見・ご指摘' },
            { emoji: '💡', text: '取り上げてほしい防災テーマのご提案' },
            { emoji: '🔗', text: 'リンク切れ・表示崩れのご報告' },
            { emoji: '📣', text: 'メディア取材・コラボレーションのご相談' },
          ].map((item) => (
            <div key={item.text} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              fontSize: 14, color: '#334155',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.emoji}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
