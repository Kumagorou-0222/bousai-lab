import { resolveScheduledSlot } from './core.mjs'

// 認証・候補・X送信の接続が完了するまで外部通信を行わない。
export async function runScheduled(controller, env, { now = new Date(), log = console.log } = {}) {
  const event = resolveScheduledSlot(controller, now)
  if (!event) return log(JSON.stringify({ result: '時間外のため見送り' }))
  if (env?.DRY_RUN === 'false') throw new Error('直接投稿の接続が未完了です')
  log(JSON.stringify({ result: 'ドライラン', slot: event.slot, slotDate: event.slotDate,
    plannedAt: event.plannedAt, actualAt: event.actualAt }))
}

export default {
  async scheduled(controller, env) {
    return runScheduled(controller, env)
  },
}
