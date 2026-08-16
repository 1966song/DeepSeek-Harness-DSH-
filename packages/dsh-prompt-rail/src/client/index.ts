/** Browser entry: register the message-jump rail in ChatView's navigator seat. */
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { MessageJumpRail } from './MessageJumpRail.tsx'
import { NS, en, zh } from './locales.ts'
import { adoptStyles } from './styles.ts'

/** Client services needed to add one slot entry and its localized copy. */
export const inject = ['slots', 'locale']

/**
 * Mount the browser contribution.
 * @param ctx - Client context for the installed plugin.
 */
export function apply(ctx: ClientContext): void {
  adoptStyles()
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-prompt-rail: dictionaries')
  ctx.slots.inject('conversation.chat.navigator', () => ctx.slots.register({
    name: 'conversation.chat.navigator',
    id: 'message-jump-rail',
    order: 0,
    locale: NS,
  }, MessageJumpRail))
}
