import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import KidsModeButton from '@/components/KidsModeButton'
import KidsModeTransformer from '@/components/KidsModeTransformer'
import KidsCharacter from '@/components/KidsCharacter'
import Script from 'next/script'

const SITE_URL = 'https://bousai-lab.vercel.app'
const SITE_NAME = '防災Lab'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}｜災害が起きたとき今すぐやることがわかるサイト`,
    template: `%s｜${SITE_NAME}`,
  },
  description:
    '地震・台風・停電・避難——「今どうする？」がすぐわかる防災行動サイト。今すぐできるチェックリストと状況別ガイドを武蔵野市在住の現役医師が監修。',
  authors: [{ name: 'くまごろう（武蔵野市在住の現役勤務医師・大家さん）' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ja_JP',
    images: [{ url: '/ogp.svg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  verification: {
    google: 'fiGqF34hqP2WNS5ivLTrWirILY5voMGawdDWuDH2ma8',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-91C4WLGVH5"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-91C4WLGVH5');
          `}
        </Script>
        <Script defer src="/_vercel/insights/script.js" strategy="afterInteractive" />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3234145492070041"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <KidsModeButton />
        <KidsModeTransformer />
        <KidsCharacter />
        {/* Amazonアソシエイト タグ付与 */}
        <Script id="amazon-affiliate" strategy="afterInteractive">
          {`
            document.querySelectorAll('a[href*="amazon.co.jp"], a[href*="amzn.to"]').forEach(function(el) {
              try {
                const url = new URL(el.href);
                url.searchParams.set('tag', 'bousailab0c-22');
                el.href = url.toString();
              } catch(e) {}
            });
          `}
        </Script>
        {/* もしもアフィリエイト（楽天） */}
        <Script id="rakuten-affiliate" strategy="afterInteractive">
          {`
            (function() {
              const a_id='5428468', p_id='54', pc_id='54', pl_id='616';
              document.querySelectorAll('a[href*="rakuten.co.jp"]:not([href*="room.rakuten.co.jp"]), a[href*="rakuten.com"]').forEach(function(el) {
                const orig = el.href;
                el.href = 'https://af.moshimo.com/af/c/click?a_id='+a_id+'&p_id='+p_id+'&pc_id='+pc_id+'&pl_id='+pl_id+'&url='+encodeURIComponent(orig);
                el.setAttribute('rel','nofollow');
              });
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
