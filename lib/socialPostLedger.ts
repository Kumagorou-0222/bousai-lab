export type SocialPostKey = { channel: 'threads' | 'instagram'; accountId: string; dateJst: string; slug: string; campaign: string }

export type SocialPostRecord = SocialPostKey & {
  status: 'reserved' | 'container_ready' | 'published'
  reservedAt: string
  containerId?: string
  publishedAt?: string
  postId?: string
}

export interface SocialPostLedger {
  reserve(key: SocialPostKey): Promise<void>
  markContainer(key: SocialPostKey, containerId: string): Promise<void>
  markPublished(key: SocialPostKey, postId: string): Promise<void>
}

export function ledgerPath(key: SocialPostKey) {
  if (!/^[a-z0-9-]+$/.test(key.slug) || !/^[a-z0-9-]+$/.test(key.campaign) ||
      !/^\d+$/.test(key.accountId) || !/^\d{4}-\d{2}-\d{2}$/.test(key.dateJst)) {
    throw new Error('投稿台帳のキーが不正です')
  }
  return `.social-post-ledger/${key.channel}/${key.accountId}/${key.dateJst}.json`
}

type GithubFile = { sha: string; content: string; encoding: string }

export class GithubSocialPostLedger implements SocialPostLedger {
  private readonly token: string
  private readonly branch: string

  constructor() {
    const token = process.env.SOCIAL_LEDGER_GITHUB_TOKEN
    const branch = process.env.SOCIAL_LEDGER_BRANCH
    if (!token || branch !== 'social-ledger') {
      throw new Error('専用の永続投稿台帳が設定されていません')
    }
    this.token = token
    this.branch = branch
  }

  private url(key: SocialPostKey) {
    return `https://api.github.com/repos/Kumagorou-0222/bousai-lab/contents/${ledgerPath(key)}`
  }

  private headers() {
    return {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${this.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    }
  }

  private async put(key: SocialPostKey, record: SocialPostRecord, sha?: string) {
    const response = await fetch(this.url(key), {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify({
        message: `Record ${key.channel} post ${key.slug} ${key.campaign}`,
        content: Buffer.from(JSON.stringify(record)).toString('base64'),
        branch: this.branch,
        ...(sha ? { sha } : {}),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`投稿台帳の更新に失敗しました (${response.status})。再送は禁止です`)
  }

  async reserve(key: SocialPostKey) {
    const record: SocialPostRecord = { ...key, status: 'reserved', reservedAt: new Date().toISOString() }
    // SHAを付けない作成操作で同一キーの二重予約を防ぐ。競合・通信失敗時は送信しない。
    await this.put(key, record)
  }

  private async readReserved(key: SocialPostKey) {
    const response = await fetch(`${this.url(key)}?ref=${encodeURIComponent(this.branch)}`, {
      headers: this.headers(), cache: 'no-store', signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error('投稿台帳の予約を読み取れません。再送は禁止です')
    const file = await response.json() as GithubFile
    if (file.encoding !== 'base64' || !file.sha) throw new Error('投稿台帳の予約形式が不正です。再送は禁止です')
    const record = JSON.parse(Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8')) as SocialPostRecord
    if (record.channel !== key.channel || record.accountId !== key.accountId ||
        record.dateJst !== key.dateJst || record.slug !== key.slug || record.campaign !== key.campaign) {
      throw new Error('投稿台帳の予約が一致しません。再送は禁止です')
    }
    return { record, sha: file.sha }
  }

  async read(key: SocialPostKey): Promise<SocialPostRecord> {
    const { record } = await this.readReserved(key)
    return record
  }

  async markContainer(key: SocialPostKey, containerId: string) {
    const { record, sha } = await this.readReserved(key)
    if (record.status !== 'reserved') throw new Error('投稿台帳の状態が一致しません。再送は禁止です')
    await this.put(key, { ...record, status: 'container_ready', containerId }, sha)
  }

  async markPublished(key: SocialPostKey, postId: string) {
    const { record, sha } = await this.readReserved(key)
    if (record.status !== 'container_ready' || !record.containerId) {
      throw new Error('投稿台帳にコンテナIDがありません。再送は禁止です')
    }
    await this.put(key, { ...record, status: 'published', publishedAt: new Date().toISOString(), postId }, sha)
  }
}
