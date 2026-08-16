/**
 * Browser entry: register the market entry into the sidebar footer action row
 * (ordered before the Usage entry).
 */
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { NS, en, zh } from './locales.ts'
import { MarketPanel } from './MarketPanel.tsx'

/** Client services needed to add one sidebar action and its localized copy. */
export const inject = ['slots', 'locale']

/**
 * Mount the browser contribution.
 * @param ctx - Client context for the installed plugin.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-market: dictionaries')
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'market',
    order: 5,
    locale: NS,
  }, MarketPanel))
}
