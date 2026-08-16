import type { Context } from '@deepseek-ai/cordis';
/** Cordis function-plugin name. */
export declare const name = "dsh-market";
/** Host services needed by the market routes. */
export declare const inject: string[];
/**
 * Register the Host half: the market routes.
 * @param ctx - Host context for the installed plugin.
 */
export declare function apply(ctx: Context): void;
export type { MarketCatalog, MarketPlugin, MarketResult } from './shared.ts';
