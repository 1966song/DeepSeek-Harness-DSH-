/**
 * Session-log folding for the usage dashboard: last-wins usage samples per
 * (turn, step) — a usage chunk seeds the step and the finalized assistant
 * message replaces it, mirroring the token-meter fold so nothing double
 * counts — then totals and per-local-day buckets.
 */
import type { TokenUsage } from '@deepseek-ai/dsh-llm'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import { costOf } from './pricing.ts'
import { emptyBuckets, type UsageBuckets } from './shared.ts'

/** Per-session fold result. */
export interface SessionFold {
  /** Cumulative buckets across every final sample in the log. */
  totals: UsageBuckets
  /** Buckets keyed by local day (YYYY-MM-DD). */
  days: Map<string, UsageBuckets>
  /** Last event time in Unix epoch ms. */
  updatedAt: number
  /** Closed turn count (turn/start events). */
  turns: number
}

/** Local calendar-day key for a time. */
export function localDayKey(time: number): string {
  const date = new Date(time)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Extract the four disjoint token buckets from one usage sample. */
function bucketsOf(usage: TokenUsage): { uncachedInput: number; cacheRead: number; cacheWrite: number; output: number } {
  return {
    uncachedInput: usage.inputTokens,
    cacheRead: usage.cacheReadTokens ?? 0,
    cacheWrite: usage.cacheWriteTokens ?? 0,
    output: usage.outputTokens,
  }
}

/**
 * Fold one session's raw events into totals + per-day buckets.
 * @param events - the complete raw event log of one session.
 * @returns the fold result.
 */
export function foldSession(events: readonly SessionEvent[]): SessionFold {
  const samples = new Map<string, { usage: TokenUsage; time: number }>()
  let turns = 0
  let updatedAt = 0
  for (const event of events) {
    if (event.time > updatedAt) updatedAt = event.time
    if (event.type === 'turn/start') {
      turns += 1
    } else if (event.type === 'assistant/chunk' && event.data.chunk.type === 'usage') {
      samples.set(`${event.data.turn}:${event.data.step}`, { usage: event.data.chunk.usage, time: event.time })
    } else if (event.type === 'assistant/message' && event.data.usage !== undefined) {
      samples.set(`${event.data.turn}:${event.data.step}`, { usage: event.data.usage, time: event.time })
    }
  }

  const totals = emptyBuckets()
  const days = new Map<string, UsageBuckets>()
  for (const { usage, time } of samples.values()) {
    const buckets = bucketsOf(usage)
    totals.uncachedInput += buckets.uncachedInput
    totals.cacheRead += buckets.cacheRead
    totals.cacheWrite += buckets.cacheWrite
    totals.output += buckets.output
    const key = localDayKey(time)
    let day = days.get(key)
    if (day === undefined) {
      day = emptyBuckets()
      days.set(key, day)
    }
    day.uncachedInput += buckets.uncachedInput
    day.cacheRead += buckets.cacheRead
    day.cacheWrite += buckets.cacheWrite
    day.output += buckets.output
  }
  totals.cost = costOf(totals)
  for (const day of days.values()) day.cost = costOf(day)

  return { totals, days, updatedAt, turns }
}
