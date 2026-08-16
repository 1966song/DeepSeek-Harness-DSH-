/**
 * Browser entry: register the usage entry into the sidebar footer action row.
 */
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { NS, en, zh } from './locales.ts'
import { UsagePanel } from './UsagePanel.tsx'

/** Client services needed to add one sidebar action and its localized copy. */
export const inject = ['slots', 'locale']

/**
 * Mount the browser contribution.
 * @param ctx - Client context for the installed plugin.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-usage: dictionaries')
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'usage',
    order: 10,
    locale: NS,
  }, UsagePanel))
}
