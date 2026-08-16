/**
 * Wire types shared by the host route and the browser dashboard. Both halves
 * compile this module into their own bundle, so the payload contract lives in
 * exactly one place.
 */

/** One token bucket of a day or session. */
export interface UsageBuckets {
  /** Provider-reported uncached input tokens. */
  uncachedInput: number
  /** Cache read (cache hit) tokens. */
  cacheRead: number
  /** Cache write tokens. */
  cacheWrite: number
  /** Output (completion) tokens. */
  output: number
  /** Estimated cost in the pricing currency (see {@link UsagePricing}). */
  cost: number
}

/** Official-price table used for the cost estimate (editable constant). */
export interface UsagePricing {
  /** Currency label (CNY). */
  currency: string
  /** ¥ per 1M uncached input tokens. */
  inputPerM: number
  /** ¥ per 1M cache-read tokens. */
  cacheReadPerM: number
  /** ¥ per 1M cache-write tokens. */
  cacheWritePerM: number
  /** ¥ per 1M output tokens. */
  outputPerM: number
}

/** One per-day bucket row (local calendar day). */
export interface UsageDay extends UsageBuckets {
  /** Local date key, YYYY-MM-DD. */
  day: string
}

/** One per-session breakdown row. */
export interface UsageSession extends UsageBuckets {
  /** Durable session id. */
  id: string
  /** Latest durable title (falls back to the id). */
  title: string
  /** Last event time in Unix epoch ms. */
  updatedAt: number
  /** Closed turns counted from the log. */
  turns: number
}

/** Account balance snapshot from the official balance API. */
export interface UsageBalance {
  /** Whether the account is available for requests. */
  available: boolean
  /** Balance currency (CNY). */
  currency: string
  /** Total balance. */
  total: number
  /** Granted (promotional) balance. */
  granted: number
  /** Topped-up balance. */
  toppedUp: number
  /** Human-readable error when the balance lookup failed. */
  error?: string
}

/** The full payload served by GET /api/dsh-usage/overview. */
export interface UsageOverview {
  /** Generation time in Unix epoch ms. */
  generatedAt: number
  /** The pricing table used for cost estimates. */
  pricing: UsagePricing
  /** Grand totals across all folded sessions. */
  totals: UsageBuckets & { sessions: number }
  /** Per-local-day buckets, oldest first (last 30 days). */
  perDay: UsageDay[]
  /** Per-session rows, newest first (capped). */
  perSession: UsageSession[]
  /** Balance lookup result (null when no API key is configured). */
  balance: UsageBalance | null
}

/** Empty bucket helper (keeps payloads compact and stable). */
export function emptyBuckets(): UsageBuckets {
  return { uncachedInput: 0, cacheRead: 0, cacheWrite: 0, output: 0, cost: 0 }
}
