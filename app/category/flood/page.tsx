import type { Metadata } from 'next'
import ExtendedCategoryPage from '@/components/ExtendedCategoryPage'

export const metadata: Metadata = {
  title: '浸水・洪水【何cmで危険？避難判断の目安】',
  description:
    '浸水何cmで歩けなくなるか・車は流されるか。地下駐車場・マンション上層階の避難判断。洪水ハザードマップの見方を解説。',
  alternates: { canonical: 'https://bousai-lab.vercel.app/category/flood' },
  openGraph: {
    title: '浸水・洪水【避難判断の目安】｜防災Lab',
    description: '浸水何cmで歩行・車が危険になるか。地下・マンションの避難判断マニュアル。',
    url: 'https://bousai-lab.vercel.app/category/flood',
  },
}

export default function FloodCategoryPage() {
  return (
    <ExtendedCategoryPage
      category="flood"
      heroTitle="浸水・洪水から命を守ろう"
      rissMessage="道路が冠水してきた…歩いて逃げてもいい？"
      robotMessage="浸水30cmで歩行困難、60cmで車も流される。地下には絶対入るな。迷ったら上層階へ垂直避難せよ"
      heroSubtitle="「少しくらい大丈夫」が一番危ない"
      ctaProducts={['防災リュック', 'モバイルバッテリー', '懐中電灯', '非常食']}
    />
  )
}
