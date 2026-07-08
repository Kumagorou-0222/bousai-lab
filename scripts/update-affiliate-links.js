const fs = require('fs')

const root = 'H:/マイドライブ/031_bousai-lab'

const productPages = [
  `${root}/app/blackout-items/page.tsx`,
  `${root}/app/earthquake-items/page.tsx`,
  `${root}/app/typhoon-items/page.tsx`,
]

for (const file of productPages) {
  let text = fs.readFileSync(file, 'utf8')

  if (!text.includes('affiliateLinks')) {
    text = text.replace(
      "import AffiliateButtons from '@/components/AffiliateButtons'",
      "import AffiliateButtons from '@/components/AffiliateButtons'\nimport { amazonProductUrl, rakutenRoomUrl } from '@/lib/affiliateLinks'",
    )
  }

  text = text.replace(
    /const RAKUTEN_ID = '1400711'\s*const rkt = \(keyword: string\) =>\s*`https:\/\/hb\.afl\.rakuten\.co\.jp\/hgc\/\$\{RAKUTEN_ID\}\/\?pc=\$\{encodeURIComponent\(`https:\/\/search\.rakuten\.co\.jp\/search\/mall\/\$\{keyword\}\/`\)\}`/g,
    'const rkt = (_keyword: string) => rakutenRoomUrl()',
  )

  text = text.replace(
    /amazonUrl: `https:\/\/www\.amazon\.co\.jp\/s\?k=([^`]+)&tag=bousailab0c-22`,/g,
    (_match, query) => `amazonUrl: amazonProductUrl('${query.replace(/\+/g, ' ').replace(/'/g, "\\'")}'),`,
  )

  text = text.replace(
    /<a href=\{`https:\/\/www\.amazon\.co\.jp\/s\?k=([^`]+)&tag=bousailab0c-22`\}/g,
    (_match, query) => `<a href={amazonProductUrl('${query.replace(/\+/g, ' ').replace(/'/g, "\\'")}')}`,
  )

  text = text.replace(/🛍️ 楽天で見る/g, '🛍️ 楽天ROOMで見る')

  fs.writeFileSync(file, text, 'utf8')
}
