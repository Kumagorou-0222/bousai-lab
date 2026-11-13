const schedules = new Map([
  ['0,15,30 22 * * *', 'morning'],
  ['0,15,30 3 * * *', 'noon'],
  ['*/15 9-12 * * *', 'night'],
  ['55 12 * * *', 'night'],
])

function jstParts(date) {
  const shifted = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return { date: shifted.toISOString().slice(0, 10), minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes() }
}

export function resolveScheduledSlot(controller, now = new Date()) {
  const slot = schedules.get(controller?.cron)
  const planned = new Date(controller?.scheduledTime)
  if (!slot || !Number.isFinite(planned.getTime()) || !Number.isFinite(now.getTime()) || now < planned) return null
  const expectedUtc = slot === 'morning' ? 22 : slot === 'noon' ? 3 : controller.cron === '55 12 * * *' ? 12 : null
  if (expectedUtc !== null && planned.getUTCHours() !== expectedUtc) return null
  if (slot === 'morning' || slot === 'noon') {
    if (![0, 15, 30].includes(planned.getUTCMinutes())) return null
  } else if (controller.cron === '55 12 * * *') {
    if (planned.getUTCMinutes() !== 55) return null
  } else if (planned.getUTCHours() < 9 || planned.getUTCHours() > 12 || planned.getUTCMinutes() % 15 !== 0) return null
  const plannedJst = jstParts(planned)
  const actualJst = jstParts(now)
  const windows = { morning: [7 * 60, 12 * 60], noon: [12 * 60, 18 * 60], night: [18 * 60, 22 * 60] }
  const [start, end] = windows[slot]
  if (plannedJst.date !== actualJst.date || actualJst.minutes < start || actualJst.minutes >= end) return null
  return { slot, slotDate: plannedJst.date, plannedAt: planned.toISOString(), actualAt: now.toISOString() }
}

function recordDate(record) {
  return record.slotDate || record.postedAt?.slice(0, 10)
}

export function blocksSlot(record, slot, date) {
  if (record.slot !== slot || recordDate(record) !== date) return false
  if (record.success) return true
  if (record.postStatus === 'failed_before_send' || record.nightStatus === 'failed_before_send') return false
  return Boolean(record.postStatus || record.nightStatus)
}

export function chooseDayCandidate(candidates, history, random = Math.random) {
  const weights = { S: 5, A: 3, B: 1 }
  const now = Date.now()
  const available = (hours) => {
    const recent = new Set(history.filter(r => r.success && new Date(r.postedAt).getTime() >= now - hours * 3600000).map(r => r.slug))
    return candidates.filter(c => !recent.has(c.slug))
  }
  const pool = available(168).length ? available(168) : available(48).length ? available(48) : candidates
  const total = pool.reduce((n, c) => n + (weights[c.rank] || 1), 0)
  if (!total) return null
  let pick = Math.min(Math.max(random(), 0), 0.999999999) * total
  for (const candidate of pool) {
    pick -= weights[candidate.rank] || 1
    if (pick < 0) return candidate
  }
  return pool.at(-1)
}

export async function runPostAttempt({ controller, now = new Date(), clock = () => new Date(), attemptId, store, getCandidate, publisher, dryRun = true }) {
  const event = resolveScheduledSlot(controller, now)
  if (!event) return { status: 'outside_window' }
  if (dryRun) return { status: 'dry_run', ...event }
  if (!/^[-\w]{1,100}$/.test(attemptId || '')) throw new Error('実行IDが不正です')
  if (!store || !getCandidate || !publisher) throw new Error('投稿用の接続が未設定です')

  // GitHub履歴のSHA付き更新を唯一の共有予約として扱う。
  let reservation
  let selected
  for (let tries = 0; tries < 3; tries++) {
    const { sha, records } = await store.read()
    if (!sha || !Array.isArray(records)) throw new Error('履歴を安全に読み取れません')
    const candidate = await getCandidate(event, records)
    if (!candidate?.slug || !candidate?.text || !candidate?.title ||
        (event.slot === 'night' && (candidate.slotDate !== event.slotDate || !candidate.nightImageId || !candidate.imageSha256))) {
      throw new Error('当日分の投稿候補を確認できません')
    }
    if (records.some(record => record.postAttemptId === attemptId)) return { status: 'already_reserved' }
    if (records.some(record => blocksSlot(record, event.slot, event.slotDate))) return { status: 'already_reserved' }
    reservation = {
      postedAt: new Date(now.getTime() + 9 * 3600000).toISOString().replace('Z', '+09:00'),
      slotDate: event.slotDate, slot: event.slot, slug: candidate.slug, title: candidate.title,
      text: candidate.text, hasImage: Boolean(candidate.imagePath), imageLocalPath: candidate.imagePath || null,
      success: false, postAttemptId: attemptId, postStatus: 'reserved',
      ...(event.slot === 'night' ? { nightImageId: candidate.nightImageId, nightAttemptId: attemptId, nightStatus: 'reserved' } : {}),
    }
    if (await store.write(sha, [...records, reservation])) {
      selected = candidate
      break
    }
    reservation = null
  }
  if (!reservation) throw new Error('履歴の予約競合を解決できません')

  const update = async (status, tweet) => {
    const { sha, records } = await store.read()
    const own = records.find(r => r.postAttemptId === attemptId && r.slotDate === event.slotDate && r.slot === event.slot)
    if (!own || own.postStatus !== 'reserved') throw new Error('確定済みの投稿予約がありません')
    own.postStatus = status
    if (event.slot === 'night') own.nightStatus = status
    if (tweet) {
      own.success = true
      own.tweetId = tweet.id
      own.tweetUrl = `https://x.com/i/web/status/${tweet.id}`
    }
    if (!await store.write(sha, records)) throw new Error('投稿結果を履歴へ確定できません')
  }

  let sendStarted = false
  try {
    const candidate = selected
    if (event.slot === 'night' && candidate.slotDate !== event.slotDate) throw new Error('素材日付が変わりました')
    const media = await publisher.prepare(candidate)
    if (!resolveScheduledSlot(controller, clock())) throw new Error('送信直前に投稿時間外になりました')
    const latest = await store.read()
    if (!latest.records?.some(r => r.postAttemptId === attemptId && r.slotDate === event.slotDate &&
        r.slot === event.slot && r.postStatus === 'reserved')) throw new Error('送信直前に投稿予約を確認できません')
    sendStarted = true
    const tweet = await publisher.send(candidate, media)
    if (!tweet?.id) throw new Error('投稿結果が不明です')
    await update('posted', tweet)
    return { status: 'posted', tweetId: tweet.id }
  } catch (error) {
    if (sendStarted) {
      try { await update('unknown') } catch { /* 予約を保持し、自動再送を防ぐ。 */ }
    } else {
      try { await update('failed_before_send') } catch { /* 予約を保持し、自動再送を防ぐ。 */ }
    }
    throw error
  }
}
