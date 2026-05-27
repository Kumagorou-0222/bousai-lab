import type { Metadata } from 'next'
import { getAllDrafts, validateDraftQuality } from '@/lib/draftUtils'
import { CATEGORY_MAP } from '@/lib/categories'

export const metadata: Metadata = {
  title: '下書き管理｜防災Lab',
  robots: { index: false, follow: false },
}

const EMOTION_LABELS: Record<string, string> = {
  worried: '😟心配',
  surprised: '😲驚き',
  serious: '😐真剣',
  normal: '🤖普通',
  relieved: '😌安心',
  happy: '😊喜び',
  scared: '😨怖い',
}

export default function DraftsPage() {
  const drafts = getAllDrafts()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">下書き管理</h1>
      <p className="text-sm text-gray-500 mb-6">
        自動生成された下書き一覧。確認後に{' '}
        <code className="bg-gray-100 px-1 rounded">content/drafts/</code> →{' '}
        <code className="bg-gray-100 px-1 rounded">content/articles/</code>{' '}
        に移動して公開。
      </p>

      {drafts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-lg">下書きがありません</p>
          <p className="text-sm mt-2">
            <code>npx tsx scripts/generateArticleDraft.ts</code> を実行してください
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {drafts.map((draft) => {
            const { valid, warnings } = validateDraftQuality(draft)
            const cat = CATEGORY_MAP[draft.category]

            return (
              <article
                key={draft.slug}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                {/* ヘッダー */}
                <div className="bg-gray-50 px-4 py-3 flex items-start gap-3">
                  <span className="text-2xl">{draft.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base leading-snug">{draft.title}</h2>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {cat?.emoji} {cat?.label}
                      </span>
                      {draft.xSeries && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          【{draft.xSeries}】
                        </span>
                      )}
                      <span className="text-gray-400">{draft.date}</span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                        下書き
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {valid ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                        ✅ OK
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">
                        ⚠ {warnings.length}件
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* バリデーション警告 */}
                  {warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-xs font-bold text-yellow-700 mb-1">公開前チェック</p>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        {warnings.map((w, i) => (
                          <li key={i}>
                            ⚠ [{w.field}] {w.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 結論 */}
                  {draft.conclusion && (
                    <div className="bg-green-50 border-l-4 border-green-400 px-3 py-2">
                      <p className="text-xs font-bold text-green-700 mb-0.5">結論</p>
                      <p className="text-sm">{draft.conclusion}</p>
                    </div>
                  )}

                  {/* 4コマプレビュー */}
                  {draft.manga?.panels?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2">
                        4コマ漫画 ({draft.manga.panels.length}コマ)
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {draft.manga.panels.map((panel, i) => (
                          <div
                            key={i}
                            className={`rounded p-2 text-xs border ${
                              panel.character === 'riss'
                                ? 'bg-pink-50 border-pink-200'
                                : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <p className="font-bold mb-1">
                              {i + 1}コマ目{' '}
                              {panel.character === 'riss' ? '🐿 リス' : '🤖 ロボ'}
                            </p>
                            <p className="text-gray-500 mb-1">
                              {EMOTION_LABELS[panel.emotion] ?? panel.emotion}
                            </p>
                            <p className="leading-snug">「{panel.message}」</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* mangaPrompt */}
                  {draft.mangaPrompt && (
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs font-bold text-gray-500 mb-1">漫画生成プロンプト</p>
                      <p className="text-xs text-gray-600 font-mono">{draft.mangaPrompt}</p>
                    </div>
                  )}

                  {/* FAQ */}
                  {draft.faqs?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2">
                        FAQ ({draft.faqs.length}件)
                      </p>
                      <div className="space-y-2">
                        {draft.faqs.map((faq, i) => (
                          <div key={i} className="text-sm border rounded p-2">
                            <p className="font-bold text-xs">Q. {faq.question}</p>
                            <p className="text-gray-600 text-xs mt-0.5">A. {faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 収益導線 */}
                  {(draft.monetizeItems ?? []).length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-1">収益導線</p>
                      <div className="flex flex-wrap gap-2">
                        {draft.monetizeItems!.map((item, i) => (
                          <span
                            key={i}
                            className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 本文プレビュー */}
                  {draft.content && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-xs font-bold text-gray-500 hover:text-gray-700">
                        本文プレビュー（クリックで展開）
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                        {draft.content}
                      </div>
                    </details>
                  )}

                  {/* 公開手順 */}
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
                    <p className="font-bold mb-1">公開手順</p>
                    <code>
                      content/drafts/{draft.slug}.mdx → content/articles/{draft.slug}.mdx
                    </code>
                    <p className="mt-1 text-blue-500">
                      ファイルを移動後、frontmatter の status/reviewRequired/autoGenerated を削除してコミット
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
