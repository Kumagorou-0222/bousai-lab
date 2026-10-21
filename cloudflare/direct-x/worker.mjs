import { resolveScheduledSlot } from './core.mjs'

// �F�؁E���EX���M�̐ڑ�����������܂ŊO���ʐM���s��Ȃ��B
export async function runScheduled(controller, env, { now = new Date(), log = console.log } = {}) {
  const event = resolveScheduledSlot(controller, now)
  if (!event) return log(JSON.stringify({ result: '���ԊO�̂��ߌ�����' }))
  if (env?.DRY_RUN === 'false') throw new Error('���ړ��e�̐ڑ����������ł�')
  log(JSON.stringify({ result: '�h���C����', slot: event.slot, slotDate: event.slotDate,
    plannedAt: event.plannedAt, actualAt: event.actualAt }))
}

export default {
  async scheduled(controller, env) {
    return runScheduled(controller, env)
  },
}

