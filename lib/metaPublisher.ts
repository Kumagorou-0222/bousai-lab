import { campaignUrl } from './socialCampaign.ts'
import { GithubSocialPostLedger, type SocialPostLedger, type SocialPostKey, type SocialPostRecord } from './socialPostLedger.ts'

type MetaChannel = 'threads' | 'instagram'
type PublishInput = {
  channel: MetaChannel
  slug: string
  text: string
  imageUrl?: string
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
    if (attempt < 5) await wait(1000)
  }
  throw new Error('Metaコンテナの準備が制限時間内に完了しませんでした。再送は禁止です')
}

export async function publishMetaPost(
  input: PublishInput,
  options: { ledger?: SocialPostLedger; transport?: MetaPostTransport; checkStatus?: MetaStatusTransport; checkConnection?: (channel: MetaChannel) => Promise<boolean>; wait?: (ms: number) => Promise<void> } = {},
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
  if (!input.text.includes(campaignUrl(input.slug, input.channel, input.campaign)) && input.channel === 'threads') {
    throw new Error('記事への計測リンクがありません')
  }
  let validInstagramImage = false
  try { validInstagramImage = Boolean(input.imageUrl && new URL(input.imageUrl).origin === 'https://bousai-lab.vercel.app') } catch { /* URL不正 */ }
  if (input.channel === 'instagram' && !validInstagramImage) {
    throw new Error('Instagram画像の公開URLが不正です')
  }
  const { accountId, token } = credentials(input.channel)
  const graphVersion = process.env.META_GRAPH_VERSION
  if (input.channel === 'instagram' && (!graphVersion || !/^v\d+\.\d+$/.test(graphVersion))) {
    throw new Error('Instagram Graph APIの確認済みバージョンが未設定です')
  }
  const base = input.channel === 'threads' ? 'https://graph.threads.net/v1.0' : `https://graph.instagram.com/${graphVersion}`
  const ledger = options.ledger ?? new GithubSocialPostLedger()
  const transport = options.transport ?? postForm
  const key = { channel: input.channel, slug: input.slug, campaign: input.campaign }
  // 送信直前にトークンの所有者を照合し、別アカウントへの投稿を防ぐ。
  if (!await (options.checkConnection ?? checkMetaConnection)(input.channel)) {
    throw new Error('Meta認証のアカウントIDが一致しません')
  }
  await ledger.reserve(key)
  const media: Record<string, string> = input.channel === 'threads'
    ? { media_type: 'TEXT', text: input.text }
    : { image_url: input.imageUrl!, caption: input.text }
  const creationId = await transport(`${base}/${accountId}/${input.channel === 'threads' ? 'threads' : 'media'}`, media, token)
  await ledger.markContainer(key, creationId)
  await waitForContainerReady(input.channel, creationId, token, graphVersion ?? '', options.checkStatus, options.wait)
  const postId = await transport(`${base}/${accountId}/${input.channel === 'threads' ? 'threads_publish' : 'media_publish'}`, { creation_id: creationId }, token)
  try {
    await ledger.markPublished(key, postId)
  } catch {
    throw new PostRecordError(postId)
  }
  return postId
}
