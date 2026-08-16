import type { SessionEvent } from '@deepseek-ai/dsh-session';
import { type UsageBuckets } from './shared.ts';
/** Per-session fold result. */
export interface SessionFold {
    /** Cumulative buckets across every final sample in the log. */
    totals: UsageBuckets;
    /** Buckets keyed by local day (YYYY-MM-DD). */
    days: Map<string, UsageBuckets>;
    /** Last event time in Unix epoch ms. */
    updatedAt: number;
    /** Closed turn count (turn/start events). */
    turns: number;
}
/** Local calendar-day key for a time. */
export declare function localDayKey(time: number): string;
/**
 * Fold one session's raw events into totals + per-day buckets.
 * @param events - the complete raw event log of one session.
 * @returns the fold result.
 */
export declare function foldSession(events: readonly SessionEvent[]): SessionFold;
