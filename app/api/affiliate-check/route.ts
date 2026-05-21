export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return Response.json({ error: 'url パラメータが必要です' }, { status: 400 })
  }

  let targetUrl: URL
  try {
    targetUrl = new URL(url)
  } catch {
    return Response.json({ status: 0, ok: false, error: '無効なURL形式' })
  }

  // 許可するドメインのみチェック
  const allowedDomains = [
    'amazon.co.jp',
    'www.amazon.co.jp',
    'search.rakuten.co.jp',
    'item.rakuten.co.jp',
    'hb.afl.rakuten.co.jp',
  ]
  if (!allowedDomains.some((d) => targetUrl.hostname === d || targetUrl.hostname.endsWith('.' + d))) {
    return Response.json({ status: 0, ok: false, error: '対象外ドメイン' })
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BousaiLabAudit/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    })
    clearTimeout(timer)

    return Response.json({
      status: res.status,
      ok: res.status >= 200 && res.status < 400,
      redirected: res.status === 301 || res.status === 302,
      location: res.headers.get('location') ?? null,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    const isTimeout = msg.includes('abort') || msg.includes('timeout')
    return Response.json({
      status: 0,
      ok: false,
      error: isTimeout ? 'タイムアウト（8秒）' : 'ネットワークエラー',
    })
  }
}
