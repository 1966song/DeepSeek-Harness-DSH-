/**
 * Host entry for the message-jump rail. The contribution is browser-only; this
 * no-op entry lets the profile install one named bundle for both planes.
 */
import type { Context } from '@deepseek-ai/cordis'

/** Cordis function-plugin name. */
export const name = 'dsh-prompt-rail'
/** The Host entry has no service dependencies. */
export const inject: readonly [] = []

/**
 * Register the Host half. Browser client discovery is owned by the plugin
 * manifest, so there is no Host registration to keep alive.
 * @param _ctx - Host context for the installed plugin.
 */
export function apply(_ctx: Context): void {}
