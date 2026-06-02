import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '防災Labのプライバシーポリシーです。個人情報の取り扱い・広告・アクセス解析についてご説明します。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/privacy' },
  robots: { index: true, follow: true },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 40 }}>
    <h2 style={{
      fontSize: 17, fontWeight: 800, color: '#0F172A',
      borderLeft: '4px solid #2563EB', paddingLeft: 12,
      marginBottom: 14, lineHeight: 1.4,
    }}>
      {title}
    </h2>
    <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.9 }}>
      {children}
    </div>
  </section>
)

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 80px' }}>
      <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: 'プライバシーポリシー' }]} />

      <div style={{ padding: '20px 0 32px' }}>
        <h1 style={{
          fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 900,
          color: '#0F172A', fontFamily: 'Kaisei Decol, serif',
          marginBottom: 8, lineHeight: 1.3,
        }}>
          プライバシーポリシー
        </h1>
        <p style={{ fontSize: 13, color: '#94A3B8' }}>最終更新日：2026年6月3日</p>
      </div>

      <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.9, marginBottom: 40 }}>
        防災Lab（以下「当サイト」）は、利用者の個人情報を適切に保護・管理することを重要な責務と認識しています。
        本ページでは、当サイトにおける個人情報の取り扱い方針をご説明します。
      </p>

      <Section title="広告の配信について（Google AdSense）">
        <p style={{ marginBottom: 12 }}>
          当サイトは、Google LLCが提供するウェブ広告サービス「Google AdSense」を利用しています。
          Google AdSenseは、利用者がサイトを訪問した際の興味・関心に基づいて広告を表示するため、
          <strong>Cookie（クッキー）</strong>を使用する場合があります。
        </p>
        <p style={{ marginBottom: 12 }}>
          Cookieを使用することで、Googleおよびそのパートナーが当サイトや他のサイトへのアクセス情報に基づいて適切な広告を表示します。
          利用者はGoogleの広告設定ページ（<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>https://adssettings.google.com</a>）でパーソナライズ広告を無効にすることができます。
        </p>
        <p>
          また、Cookieの使用はお使いのブラウザの設定から無効化することができます。
          ただし、一部のサービスが正常に動作しなくなる場合があります。
          詳細は <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>Google ポリシーと規約</a> をご参照ください。
        </p>
      </Section>

      <Section title="アクセス解析ツールについて（Google Analytics）">
        <p style={{ marginBottom: 12 }}>
          当サイトは、Googleが提供するアクセス解析ツール「Google Analytics」を使用しています。
          Google Analyticsはトラフィックデータの収集のためにCookieを使用しています。
          このデータは匿名で収集されており、個人を特定するものではありません。
        </p>
        <p>
          この機能はCookieを無効にすることで拒否することができます。
          Google Analyticsの利用規約・プライバシーポリシーについては
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>Googleプライバシーポリシー</a> をご確認ください。
        </p>
      </Section>

      <Section title="アフィリエイトリンクについて">
        <p>
          当サイトは、Amazon.co.jpおよび楽天市場のアフィリエイトプログラムに参加しています。
          商品リンクをクリックして購入された場合、当サイトに紹介報酬が発生することがあります。
          これによって、購入者の方に追加費用が発生することはありません。
          収益はサイトの維持・運営費に充てています。
        </p>
      </Section>

      <Section title="免責事項">
        <p style={{ marginBottom: 12 }}>
          当サイトが提供する情報は、武蔵野市在住の現役医師が監修していますが、
          あくまで一般的な防災情報の提供を目的としたものです。
          個別の状況への適用については保証しておらず、
          当サイトの情報をもとに行動した結果について責任を負いかねます。
        </p>
        <p style={{ marginBottom: 12 }}>
          災害発生時には、必ず行政機関（気象庁・市区町村等）や医療機関が発信する
          最新情報を優先してください。
        </p>
        <p>
          当サイトからリンクされている外部サイトの内容について、当サイトは一切の責任を負いません。
        </p>
      </Section>

      <Section title="著作権について">
        <p>
          当サイトに掲載されているコンテンツ（文章・イラスト・漫画・キャラクター等）の著作権は、
          当サイト運営者に帰属します。
          無断での転載・複製・改変は禁止します。
          引用する場合は出典を明記してください。
        </p>
      </Section>

      <Section title="個人情報の取り扱い">
        <p>
          当サイトでは、お問い合わせフォームを通じてご提供いただいたお名前・メールアドレス等の個人情報を、
          お問い合わせへの回答のみに使用します。
          第三者への提供・開示は行いません（法令に基づく場合を除く）。
        </p>
      </Section>

      <Section title="プライバシーポリシーの変更">
        <p>
          当サイトは、必要に応じて本プライバシーポリシーの内容を変更することがあります。
          変更後のプライバシーポリシーは本ページにて公開します。
        </p>
      </Section>

      <Section title="お問い合わせ">
        <p>
          本プライバシーポリシーに関するお問い合わせは、
          <Link href="/contact" style={{ color: '#2563EB', fontWeight: 700 }}>お問い合わせページ</Link>
          からご連絡ください。
        </p>
      </Section>
    </div>
  )
}
