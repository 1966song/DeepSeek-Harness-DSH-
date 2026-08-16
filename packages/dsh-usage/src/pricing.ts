/**
 * Official DeepSeek price table used for the cost estimate. Update these
 * constants when the provider's price list changes; the estimate is labeled
 * as such in the UI.
 */
import type { UsagePricing } from './shared.ts'

/** DeepSeek official pricing (¥ per 1M tokens). */
export const PRICING: UsagePricing = {
  currency: 'CNY',
  inputPerM: 2,
  cacheReadPerM: 0.5,
  cacheWritePerM: 2,
  outputPerM: 8,
}

/**
 * Estimated cost of one bucket set at the given pricing.
 * @param buckets - the token buckets to price.
 * @param pricing - the price table (defaults to {@link PRICING}).
 * @returns the estimated cost in the pricing currency.
 */
export function costOf(
  buckets: { uncachedInput: number; cacheRead: number; cacheWrite: number; output: number },
  pricing: UsagePricing = PRICING,
): number {
  const perM = (tokens: number, price: number): number => (tokens / 1_000_000) * price
  return perM(buckets.uncachedInput, pricing.inputPerM)
    + perM(buckets.cacheRead, pricing.cacheReadPerM)
    + perM(buckets.cacheWrite, pricing.cacheWritePerM)
    + perM(buckets.output, pricing.outputPerM)
}
