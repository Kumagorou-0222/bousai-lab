import { createHash } from 'node:crypto'
import { loadImage } from 'canvas'
import { inMetaWindow, jstDate } from './metaApprovedPosts.ts'
import { GithubSocialPostLedger, type SocialPostLedger, type SocialPostKey, type SocialPostRecord } from './socialPostLedger.ts'

type MetaChannel = 'threads' | 'instagram'
type PublishInput = {
  channel: MetaChannel
  slug: string
  text: string
  imageUrl?: string
  imageSha256?: string
  accountId: string
  classification: 'noncommercial-education' | 'commercial'
  dateJst: string
  expiresAt: string
  approved: boolean
  campaign: string
}

type MetaCredentials = { accountId: string; token: string }

function credentials(channel: MetaChannel): MetaCredentials {
  const prefix = channel === 'threads' ? 'THREADS' : 'INSTAGRAM'
  const accountId = process.env[`${prefix}_ACCOUNT_ID`]
  const token = process.env[`${prefix}_ACCESS_TOKEN`]
  if (!accountId || !token) throw new Error('Meta認証が設定されていません')
  if (!/^\d+$/.test(accountId)) throw new Error('MetaアカウントIDが不正です')
  return { accountId, token }
}

export async function checkMetaConnection(
  channel: MetaChannel,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const { accountId, token } = credentials(channel)
  const graphVersion = process.env.META_GRAPH_VERSION
  if (channel === 'instagram' && (!graphVersion || !/^v\d+\.\d+$/.test(graphVersion))) {
    throw new Error('Instagram Graph APIの確認済みバージョンが未設定です')
  }
  const base = channel === 'threads' ? 'https://graph.threads.net/v1.0' : `https://graph.instagram.com/${graphVersion}`
  const url = new URL(`${base}/me`)
  url.searchParams.set('fields', 'id,username')
  const response = await fetchImpl(url, {
    method: 'GET', headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store', signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`Meta認証の読み取り確認に失敗しました (${response.status})`)
  const profile = await response.json() as { id?: unknown }
  if (profile.id !== accountId) throw new Error('Meta認証のアカウントIDが一致しません')
  return true
}

export type MetaPostTransport = (endpoint: string, fields: Record<string, string>, token: string) => Promise<string>
export type MetaStatusTransport = (channel: MetaChannel, containerId: string, token: string, graphVersion: string) => Promise<string>

async function postForm(endpoint: string, fields: Record<string, string>, token: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: new URLSearchParams(fields),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`Meta投稿APIが失敗しました (${response.status})。重複防止のため自動再試行しません`)
  const payload: unknown = await response.json()
  if (!payload || typeof payload !== 'object' || !('id' in payload) || typeof payload.id !== 'string') {
    throw new Error('Meta投稿APIの応答を確認できません。重複防止のため自動再試行しません')
  }
  return payload.id
}

export class PostRecordError extends Error {
  readonly postId: string
  constructor(postId: string) {
    super(`投稿ID ${postId} の記録に失敗しました。再送せず、投稿先と台帳を照合してください`)
    this.postId = postId
  }
}

async function fetchContainerStatus(channel: MetaChannel, containerId: string, token: string, graphVersion: string) {
  const base = channel === 'threads' ? 'https://graph.threads.net/v1.0' : `https://graph.instagram.com/${graphVersion}`
  const url = new URL(`${base}/${containerId}`)
  url.searchParams.set('fields', channel === 'threads' ? 'id,status,error_message' : 'id,status_code')
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`Metaコンテナの状態確認に失敗しました (${response.status})`)
  const result = await response.json() as { status?: string; status_code?: string }
  const status = channel === 'threads' ? result.status : result.status_code
  if (!status) throw new Error('Metaコンテナの状態を確認できません')
  return status
}

export async function checkMetaContainerStatus(channel: MetaChannel, containerId: string): Promise<string> {
  if (!/^\d+$/.test(containerId)) throw new Error('MetaコンテナIDが不正です')
  const { token } = credentials(channel)
  const graphVersion = process.env.META_GRAPH_VERSION ?? ''
  if (channel === 'instagram' && !/^v\d+\.\d+$/.test(graphVersion)) throw new Error('Instagram Graph APIの確認済みバージョンが未設定です')
  return fetchContainerStatus(channel, containerId, token, graphVersion)
}

export async function inspectPostReservation(key: SocialPostKey): Promise<{ record: SocialPostRecord; remoteStatus?: string }> {
  const record = await new GithubSocialPostLedger().read(key)
  if (!record.containerId) return { record }
  return { record, remoteStatus: await checkMetaContainerStatus(key.channel, record.containerId) }
}

export async function waitForContainerReady(
  channel: MetaChannel,
  containerId: string,
  token: string,
  graphVersion: string,
  checkStatus: MetaStatusTransport = fetchContainerStatus,
  wait: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const status = await checkStatus(channel, containerId, token, graphVersion)
    if (status === 'FINISHED') return
    if (status !== 'IN_PROGRESS') throw new Error(`Metaコンテナは公開可能な状態ではありません (${status})。再送は禁止です`)
    if (attempt < 5) await wait(60000)
  }
  throw new Error('Metaコンテナの準備が制限時間内に完了しませんでした。再送は禁止です')
}

export async function publishMetaPost(
  input: PublishInput,
  options: { ledger?: SocialPostLedger; transport?: MetaPostTransport; checkStatus?: MetaStatusTransport; checkConnection?: (channel: MetaChannel) => Promise<boolean>; wait?: (ms: number) => Promise<void>; now?: () => Date; fetchImage?: typeof fetch } = {},
): Promise<string> {
  if (process.env.META_DRY_RUN !== 'false') throw new Error('Meta投稿はドライランです')
  if (process.env.SOCIAL_PUBLISH_ENABLED !== 'true') throw new Error('Meta投稿は無効です')
  const prefix = input.channel === 'threads' ? 'THREADS' : 'INSTAGRAM'
  if (process.env[`${prefix}_PUBLISH_ENABLED`] !== 'true') throw new Error('媒体別のMeta投稿は無効です')
  const expiresAt = process.env[`${prefix}_TOKEN_EXPIRES_AT`]
  const expiry = expiresAt && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(expiresAt)
    ? Date.parse(expiresAt) : NaN
  if (!Number.isFinite(expiry) || expiry <= Date.now() + 7 * 24 * 60 * 60 * 1000) {
    throw new Error('Metaトークンの期限が未設定または7日以内です。更新を確認するまで投稿しません')
  }
  if (!input.approved) throw new Error('投稿内容と画像の承認が必要です')
  if (input.classification !== 'noncommercial-education' || /https?:\/\/|(?:amazon|a8\.net|affiliate)/i.test(input.text)) {
    throw new Error('Metaの商業投稿は広告ラベル対応まで禁止です')
  }
  const now = options.now ?? (() => new Date())
  const withinWindow = () => {
    const current = now()
    return inMetaWindow(current) && jstDate(current) === input.dateJst && current.getTime() < Date.parse(input.expiresAt)
  }
  if (!withinWindow()) throw new Error('Metaの当日18時以上22時未満の枠外です')
  let validInstagramImage = false
  try { validInstagramImage = Boolean(input.imageUrl && new URL(input.imageUrl).origin === 'https://bousai-lab.vercel.app' && /\.jpe?g$/i.test(new URL(input.imageUrl).pathname)) } catch { /* URL不正 */ }
  if (input.channel === 'instagram' && !validInstagramImage) {
    throw new Error('Instagram画像の公開URLが不正です')
  }
  const { accountId, token } = credentials(input.channel)
  if (accountId !== input.accountId) throw new Error('承認アカウントIDが接続先と一致しません')
  const graphVersion = process.env.META_GRAPH_VERSION
  if (input.channel === 'instagram' && (!graphVersion || !/^v\d+\.\d+$/.test(graphVersion))) {
    throw new Error('Instagram Graph APIの確認済みバージョンが未設定です')
  }
  const base = input.channel === 'threads' ? 'https://graph.threads.net/v1.0' : `https://graph.instagram.com/${graphVersion}`
  const ledger = options.ledger ?? new GithubSocialPostLedger()
  const transport = options.transport ?? postForm
  const key = { channel: input.channel, accountId, dateJst: input.dateJst, slug: input.slug, campaign: input.campaign }
  // 送信直前にトークンの所有者を照合し、別アカウントへの投稿を防ぐ。
  if (!await (options.checkConnection ?? checkMetaConnection)(input.channel)) {
    throw new Error('Meta認証のアカウントIDが一致しません')
  }
  if (input.imageUrl) {
    const image = new URL(input.imageUrl)
    if (image.origin !== 'https://bousai-lab.vercel.app' || !/\.jpe?g$/i.test(image.pathname) ||
        image.search || image.hash || !/^[a-f0-9]{64}$/.test(input.imageSha256 ?? '')) {
      throw new Error('承認JPEG画像のURLまたはハッシュが不正です')
    }
    const response = await (options.fetchImage ?? fetch)(image, { cache: 'no-store', signal: AbortSignal.timeout(10000) })
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().startsWith('image/jpeg')) {
      throw new Error('公開画像のJPEG形式を確認できません')
    }
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.length === 0 || bytes.length > 8 * 1024 * 1024 || bytes[0] !== 0xff || bytes[1] !== 0xd8 ||
        bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9 ||
        createHash('sha256').update(bytes).digest('hex') !== input.imageSha256) {
      throw new Error('承認JPEG画像の内容が一致しません')
    }
    let width: number
    let height: number
    try {
      const decoded = await loadImage(bytes)
      width = decoded.width
      height = decoded.height
    } catch {
      throw new Error('承認JPEG画像をデコードできません')
    }
    const ratio = width / height
    if (!Number.isFinite(ratio) || width < 320 || height < 1 ||
        (input.channel === 'instagram'
          ? width > 1440 || ratio < 4 / 5 || ratio > 1.91
          : ratio < 0.1 || ratio > 10)) {
      throw new Error('承認JPEG画像の寸法または縦横比が媒体仕様の範囲外です')
    }
  }
  if (!withinWindow()) throw new Error('Metaの投稿枠が終了しました')
  await ledger.reserve(key)
  const media: Record<string, string> = input.channel === 'threads'
    ? input.imageUrl
      ? { media_type: 'IMAGE', image_url: input.imageUrl, text: input.text }
      : { media_type: 'TEXT', text: input.text }
    : { image_url: input.imageUrl!, caption: input.text }
  const creationId = await transport(`${base}/${accountId}/${input.channel === 'threads' ? 'threads' : 'media'}`, media, token)
  await ledger.markContainer(key, creationId)
  await waitForContainerReady(input.channel, creationId, token, graphVersion ?? '', options.checkStatus, options.wait)
  if (!withinWindow()) throw new Error('Metaの投稿枠が終了しました。予約は維持します')
  const postId = await transport(`${base}/${accountId}/${input.channel === 'threads' ? 'threads_publish' : 'media_publish'}`, { creation_id: creationId }, token)
  try {
    await ledger.markPublished(key, postId)
  } catch {
    throw new PostRecordError(postId)
  }
  return postId
}
