'use client'

export default function ShareButton({
  title,
  url,
  shareText,
}: {
  title: string
  url: string
  shareText?: string
}) {
  const text = shareText ?? `${title}\n→ 今すぐ確認`
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

  return (
    <div style={{
      margin: '24px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    }}>
      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
        この情報をシェアして周りの人を助けましょう
      </p>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#000', color: 'white',
          padding: '10px 20px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 700, fontSize: 14,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
        Xでシェアする
      </a>
    </div>
  )
}
