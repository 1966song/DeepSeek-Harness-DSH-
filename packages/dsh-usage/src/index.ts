/**
 * Host entry for dsh-usage: one exact HTTP route serving the usage overview.
 * The overview folds every session's durable log (totals, per-day buckets,
 * per-session rows) and augments it with the DeepSeek account balance fetched
 * through the official balance API using the same credential seam the
 * deepseek LLM adapter uses — the API key never reaches the browser.
 */
import type { ServerResponse } from 'node:http'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type { Context } from '@deepseek-ai/cordis'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import type { SessionRecord } from '@deepseek-ai/dsh-session-query'
import { foldSession, localDayKey, type SessionFold } from './fold.ts'
import { PRICING } from './pricing.ts'
import { emptyBuckets, type UsageBalance, type UsageBuckets, type UsageDay, type UsageOverview, type UsageSession } from './shared.ts'

/** Cordis function-plugin name. */
export const name = 'dsh-usage'
/** Host services needed by the overview route. */
export const inject = ['webServer', 'sessionQuery']

/** Official balance endpoint. */
const BALANCE_URL = 'https://api.deepseek.com/user/balance'
/** Default credential reference (environment-variable name) of the deepseek provider. */
const DEFAULT_KEY_ENV = 'DEEPSEEK_API_KEY'
/** Session-fold cap (newest sessions only). */
const MAX_SESSIONS = 200
/** Per-day window length. */
const DAYS = 30
/** Concurrent session folds. */
const FOLD_CONCURRENCY = 8
/** Overview result cache TTL: the panel polls every 60s and reopens often,
 *  and session logs change only while turns run, so a short TTL makes every
 *  read nearly instant while staying fresh. */
const OVERVIEW_TTL_MS = 15_000
/** Balance cache TTL: the account balance changes slowly. */
const BALANCE_TTL_MS = 60_000

/** Cached overview payload (whole-value, immutable). */
let cachedOverview: { at: number; payload: UsageOverview } | null = null
/** Cached balance payload (null is a valid cached value: no API key). */
let cachedBalance: { at: number; balance: UsageBalance | null } | null = null

/** Write one JSON response with no-store caching. */
function writeJson(res: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(body)
}

/** Resolve the DeepSeek API key through the credentials seam (env fallback). */
async function resolveApiKey(ctx: Context): Promise<string | null> {
  const credentials = ctx.get('credentials')
  if (credentials !== undefined) {
    try {
      const hit = await credentials.resolve(credentialRef(DEFAULT_KEY_ENV))
      if (hit !== undefined) return hit.value
    } catch {
      // fall through to the environment variable
    }
  }
  return process.env[DEFAULT_KEY_ENV] ?? null
}

/** Fetch the account balance from the official API (null when no key). */
async function fetchBalance(ctx: Context): Promise<UsageBalance | null> {
  const key = await resolveApiKey(ctx)
  if (key === null) return null
  const failed = (message: string): UsageBalance => ({
    available: false, currency: 'CNY', total: 0, granted: 0, toppedUp: 0, error: message,
  })
  try {
    const response = await fetch(BALANCE_URL, {
      headers: { authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return failed(`balance api ${response.status}`)
    const payload = await response.json() as {
      is_available?: boolean
      balance_infos?: Array<{ currency?: string; total_balance?: number; granted_balance?: number; topped_up_balance?: number }>
    }
    const info = payload.balance_infos?.[0]
    if (info === undefined) return failed('empty balance response')
    return {
      available: payload.is_available ?? true,
      currency: info.currency ?? 'CNY',
      total: Number(info.total_balance ?? 0),
      granted: Number(info.granted_balance ?? 0),
      toppedUp: Number(info.topped_up_balance ?? 0),
    }
  } catch (error) {
    return failed(`balance lookup failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/** Fold the newest sessions with a small concurrency pool. */
async function foldRecords(
  ctx: Context,
  records: readonly SessionRecord[],
): Promise<Array<{ record: SessionRecord; fold: SessionFold; title?: string }>> {
  const results: Array<{ record: SessionRecord; fold: SessionFold; title?: string }> = []
  let cursor = 0
  const workers = Array.from({ length: Math.min(FOLD_CONCURRENCY, records.length) }, async () => {
    while (cursor < records.length) {
      const index = cursor
      cursor += 1
      const record = records[index]
      try {
        const [snapshot, title] = await Promise.all([
          ctx.sessionQuery.readSession(record.header.id),
          ctx.sessionQuery.readTitle(record.header.id),
        ])
        results.push({ record, fold: foldSession(snapshot.events), title: title?.title })
      } catch (error) {
        console.warn(`[dsh-usage] fold ${record.header.id}:`, error)
        results.push({ record, fold: { totals: emptyBuckets(), days: new Map(), updatedAt: record.header.createdAt, turns: 0 } })
      }
    }
  })
  await Promise.all(workers)
  return results
}

/** Compose the full overview payload. */
async function computeOverview(ctx: Context): Promise<UsageOverview> {
  const records = await ctx.sessionQuery.listSessions()
  const folded = await foldRecords(ctx, records.slice(0, MAX_SESSIONS))

  const totals = emptyBuckets()
  const days = new Map<string, UsageBuckets>()
  const perSession: UsageSession[] = []
  for (const { record, fold, title } of folded) {
    const used = fold.totals.uncachedInput + fold.totals.cacheRead + fold.totals.cacheWrite + fold.totals.output
    if (used === 0) continue
    totals.uncachedInput += fold.totals.uncachedInput
    totals.cacheRead += fold.totals.cacheRead
    totals.cacheWrite += fold.totals.cacheWrite
    totals.output += fold.totals.output
    for (const [key, day] of fold.days) {
      const target = days.get(key)
      if (target === undefined) days.set(key, { ...day })
      else {
        target.uncachedInput += day.uncachedInput
        target.cacheRead += day.cacheRead
        target.cacheWrite += day.cacheWrite
        target.output += day.output
        target.cost += day.cost
      }
    }
    perSession.push({
      id: record.header.id,
      title: title ?? record.header.id,
      updatedAt: fold.updatedAt,
      turns: fold.turns,
      ...fold.totals,
    })
  }
  totals.cost = totals.uncachedInput + totals.cacheRead + totals.cacheWrite + totals.output === 0
    ? 0
    : perSession.reduce((sum, row) => sum + row.cost, 0)
  // (totals.cost is re-derived from rows to stay consistent with rounding)

  const now = new Date()
  const perDay: UsageDay[] = []
  for (let offset = DAYS - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset)
    const key = localDayKey(date.getTime())
    perDay.push({ day: key, ...(days.get(key) ?? emptyBuckets()) })
  }

  return {
    generatedAt: Date.now(),
    pricing: PRICING,
    totals: { ...totals, sessions: perSession.length },
    perDay,
    perSession,
    balance: await cachedBalancePayload(ctx),
  }
}

/** Balance with a 60s cache (null is cacheable: no key configured). */
async function cachedBalancePayload(ctx: Context): Promise<UsageBalance | null> {
  const now = Date.now()
  if (cachedBalance !== null && now - cachedBalance.at < BALANCE_TTL_MS) {
    return cachedBalance.balance
  }
  const balance = await fetchBalance(ctx)
  cachedBalance = { at: now, balance }
  return balance
}

/** Full overview: fresh computation cached for {@link OVERVIEW_TTL_MS}. */
async function computeOverviewCached(ctx: Context): Promise<UsageOverview> {
  const now = Date.now()
  if (cachedOverview !== null && now - cachedOverview.at < OVERVIEW_TTL_MS) {
    return cachedOverview.payload
  }
  const payload = await computeOverview(ctx)
  cachedOverview = { at: now, payload }
  return payload
}

/**
 * Register the Host half: the usage overview route.
 * @param ctx - Host context for the installed plugin.
 */
export function apply(ctx: Context): void {
  ctx.webServer.register({
    kind: 'exact',
    path: '/api/dsh-usage/overview',
    handler: async (_req, res) => {
      try {
        writeJson(res, 200, await computeOverviewCached(ctx))
      } catch (error) {
        writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) })
      }
    },
  })

  // Warm the cache in the background right after boot, so the first panel
  // open hits the 15s cache instead of a cold multi-second fold.
  setTimeout(() => {
    computeOverviewCached(ctx).catch((error) => {
      console.warn('[dsh-usage] warm-up failed:', error)
    })
  }, 0)
}
