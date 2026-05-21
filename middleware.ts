import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/affiliate-audit', '/api/affiliate-check']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const user = process.env.AUDIT_USER ?? 'admin'
  const pass = process.env.AUDIT_PASSWORD

  // 環境変数未設定の場合はアクセス拒否（本番で野放しにしない）
  if (!pass) {
    return new NextResponse('AUDIT_PASSWORD 環境変数が設定されていません', { status: 503 })
  }

  const auth = req.headers.get('authorization') ?? ''
  const expected = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64')

  if (auth !== expected) {
    return new NextResponse('認証が必要です', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="BousaiLab Audit"' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/affiliate-audit/:path*', '/api/affiliate-check/:path*'],
}
