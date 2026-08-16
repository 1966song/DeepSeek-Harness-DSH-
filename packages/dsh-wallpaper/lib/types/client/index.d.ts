import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Client services needed to add one settings row and its localized copy. */
export declare const inject: string[];
/**
 * Mount the browser contribution.
 * @param ctx - Client context for the installed plugin.
 */
export declare function apply(ctx: ClientContext): void;
export type { WallpaperRowState } from './store.ts';
