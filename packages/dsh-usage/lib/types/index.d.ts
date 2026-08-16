import type { Context } from '@deepseek-ai/cordis';
/** Cordis function-plugin name. */
export declare const name = "dsh-usage";
/** Host services needed by the overview route. */
export declare const inject: string[];
/**
 * Register the Host half: the usage overview route.
 * @param ctx - Host context for the installed plugin.
 */
export declare function apply(ctx: Context): void;
