import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { COMPARE_DATA, amazonUrl, rakutenUrl } from '@/lib/compareData'

type Props = { params: Promise<{ product: string }> }

export async function generateStaticParams() {
  return Object.keys(COMPARE_DATA).map((product) => ({ product }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await params
  const data = COMPARE_DATA[product]
  if (!data) return {}
  return {
    title: `${data.name}比較【防災向け選び方】`,
    description: data.tagline,
    robots: { index: true, follow: true },
  }
}

export default async function ComparePage({ params }: Props) {
  const { product } = await params
  const data = COMPARE_DATA[product]
  if (!data) notFound()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* パンくず */}
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:underline">防災Lab</Link>
        {' › '}
        <Link href="/best-disaster-items" className="hover:underline">防災グッズ</Link>
        {' › '}
        <span>{data.name}比較</span>
      </nav>

      {/* ヘッダー */}
      <div className="mb-6">
        <div className="text-xs font-bold text-blue-600 tracking-widest mb-1">COMPARISON</div>
        <h1 className="text-2xl font-black leading-snug">
          {data.emoji} {data.name}の選び方・比較
        </h1>
        <p className="text-sm text-gray-600 mt-2">{data.tagline}</p>
      </div>

      {/* 選び方ポイント */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-bold text-blue-700 mb-2">選び方のポイント</p>
        <ul className="space-y-1">
          {data.selectionGuide.map((point, i) => (
            <li key={i} className="text-sm text-blue-900 flex gap-2">
              <span className="shrink-0">✅</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 比較テーブル */}
      <div className="mb-6">
        <h2 className="text-base font-bold mb-3">📊 タイプ別比較</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left px-3 py-2 font-bold whitespace-nowrap">タイプ</th>
                {data.columns.map((col, i) => (
                  <th key={i} className="text-left px-3 py-2 font-bold whitespace-nowrap border-l border-gray-600">
                    {col}
                  </th>
                ))}
                <th className="text-left px-3 py-2 font-bold whitespace-nowrap border-l border-gray-600">購入</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={row.recommended ? 'bg-blue-50' : ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  style={{ borderBottom: '1px solid #E2E8F0' }}
                >
                  <td className="px-3 py-3 font-medium whitespace-nowrap">
                    {row.recommended && (
                      <span className="inline-block bg-blue-600 text-white text-xs font-bold rounded px-1.5 py-0.5 mr-1">
                        おすすめ
                      </span>
                    )}
                    {row.label}
                  </td>
                  {row.cols.map((col, ci) => (
                    <td
                      key={ci}
                      className={`px-3 py-3 whitespace-nowrap border-l border-gray-100 ${row.recommended ? 'font-semibold text-blue-800' : 'text-gray-700'}`}
                    >
                      {col}
                    </td>
                  ))}
                  <td className="px-3 py-3 border-l border-gray-100">
                    <div className="flex gap-1.5 flex-wrap">
                      {row.amazonQuery && (
                        <a
                          href={amazonUrl(row.amazonQuery)}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded no-underline whitespace-nowrap"
                        >
                          Amazon
                        </a>
                      )}
                      {row.rakutenQuery && (
                        <a
                          href={rakutenUrl(row.rakutenQuery)}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded no-underline whitespace-nowrap"
                        >
                          楽天
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.tableNote && (
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">💡 {data.tableNote}</p>
        )}
      </div>

      {/* 関連記事 */}
      {Object.keys(data.relatedLabels).length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-xs font-bold text-gray-500 mb-3">📚 関連記事</p>
          <div className="flex flex-col gap-2">
            {Object.entries(data.relatedLabels).map(([slug, label]) => (
              <Link
                key={slug}
                href={`/articles/${slug}`}
                className="text-sm text-blue-700 font-semibold hover:underline flex items-center gap-1"
              >
                → {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 防災グッズ一覧へ */}
      <div className="text-center">
        <Link
          href="/best-disaster-items"
          className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-bold text-sm px-5 py-3 rounded-xl hover:border-blue-400 no-underline"
        >
          🎒 防災グッズ一覧を見る
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-6 leading-relaxed text-center">
        ※ Amazon・楽天リンクはアフィリエイトリンクです。購入価格は変わりません。
      </p>
    </main>
  )
}
