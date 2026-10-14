const CRON = '0 11 * * *'
const DISPATCH_URL = 'https://api.github.com/repos/Kumagorou-0222/bousai-lab/actions/workflows/x-auto-post.yml/dispatches'

function jstDate(date) {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function jstTimestamp(date) {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('Z', '+09:00')
}

export async function runScheduled(controller, env, { now = new Date(), fetchImpl = fetch, log = console.log } = {}) {
  const planned = new Date(controller?.scheduledTime)
  const actual = new Date(now)
  const diagnostic = {
    event: '夜枠起動',
    plannedAtJst: Number.isFinite(planned.getTime()) ? jstTimestamp(planned) : null,
    actualAtJst: Number.isFinite(actual.getTime()) ? jstTimestamp(actual) : null,
    delaySeconds: Number.isFinite(planned.getTime()) && Number.isFinite(actual.getTime())
      ? Math.floor((actual.getTime() - planned.getTime()) / 1000) : null,
  }
  const finish = (result, httpStatus) => {
    log(JSON.stringify({ ...diagnostic, result, ...(httpStatus === undefined ? {} : { httpStatus }) }))
    return result
  }

  if (controller?.cron !== CRON || !Number.isFinite(planned.getTime()) || !Number.isFinite(actual.getTime()) ||
      planned.getUTCHours() !== 11 || planned.getUTCMinutes() !== 0 ||
      actual.getTime() < planned.getTime() || jstDate(planned) !== jstDate(actual) ||
      (actual.getUTCHours() + 9) % 24 < 20 || (actual.getUTCHours() + 9) % 24 >= 22) {
    return finish('時間外または予定時刻不一致のため停止')
  }
  if (env?.DRY_RUN !== 'false') return finish('ドライラン: 起動要求なし')
  const token = env?.GITHUB_DISPATCH_TOKEN
  if (typeof token !== 'string' || !token.trim()) return finish('認証情報未設定のため停止')

  let response
  try {
    response = await fetchImpl(DISPATCH_URL, {
      method: 'POST',
      redirect: 'manual',
      cache: 'no-store',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'bousai-lab-night-dispatcher',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ ref: 'main', inputs: { slot: 'night' } }),
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    finish('起動要求の通信結果不明')
    throw new Error('GitHubへの起動要求の通信結果を確認できませんでした')
  }
  if (response.status !== 200 && response.status !== 204) {
    finish('起動要求を受理されず', response.status)
    throw new Error(`GitHub起動要求が受理されませんでした (HTTP ${response.status})`)
  }
  return finish('起動要求を受理', response.status)
}

export default {
  async scheduled(controller, env) {
    return runScheduled(controller, env)
  },
}
