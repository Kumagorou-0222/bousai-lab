import { resolveScheduledSlot } from './core.mjs'

// �F�؁E���EX���M�̐ڑ�����������܂ŊO���ʐM���s��Ȃ��B
export default {
  async scheduled(controller, env) {
    const event = resolveScheduledSlot(controller)
    if (!event) return console.log(JSON.stringify({ result: '���ԊO�̂��ߌ�����' }))
    if (env?.DRY_RUN === 'false') throw new Error('���ړ��e�̐ڑ����������ł�')
    console.log(JSON.stringify({ result: '�h���C����', slot: event.slot, slotDate: event.slotDate,
      plannedAt: event.plannedAt, actualAt: event.actualAt }))
  },
}

