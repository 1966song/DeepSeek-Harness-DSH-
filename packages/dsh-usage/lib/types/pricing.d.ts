/**
 * Official DeepSeek price table used for the cost estimate. Update these
 * constants when the provider's price list changes; the estimate is labeled
 * as such in the UI.
 */
import type { UsagePricing } from './shared.ts';
/** DeepSeek official pricing (¥ per 1M tokens). */
export declare const PRICING: UsagePricing;
/**
 * Estimated cost of one bucket set at the given pricing.
 * @param buckets - the token buckets to price.
 * @param pricing - the price table (defaults to {@link PRICING}).
 * @returns the estimated cost in the pricing currency.
 */
export declare function costOf(buckets: {
    uncachedInput: number;
    cacheRead: number;
    cacheWrite: number;
    output: number;
}, pricing?: UsagePricing): number;
