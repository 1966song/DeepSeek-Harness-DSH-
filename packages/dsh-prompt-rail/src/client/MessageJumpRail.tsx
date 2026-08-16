/**
 * Compact vertical navigator for the loaded transcript rows in one chat view.
 * One mark per user prompt and finalized assistant message; hover or keyboard
 * focus shows a preview bubble with the message text; clicking scrolls to that
 * message. Fork of Zzzzkd/dsh-prompt-rail (MIT), extended with assistant
 * markers and fuller previews.
 */
import { useState } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ChatNavigationKey, ChatNavigatorOwnerProps } from '@deepseek-ai/dsh-client-ui-conversation/client'

/** Full props delivered by the conversation navigator slot. */
export type MessageJumpRailProps = PropsRuntime<'conversation.chat.navigator'>
  & ChatNavigatorOwnerProps & PropsLocale<'message-jump-rail'>

/**
 * Render the message rail. Hover/focus controls the temporary tapered state;
 * the last activated message remains selected after that temporary state ends.
 * @param props - Navigator owner currency and plugin locale seat.
 * @returns the rail, or null when the loaded window has no addressable rows.
 */
export function MessageJumpRail({ items, jumpTo, t }: MessageJumpRailProps) {
  const [activeKey, setActiveKey] = useState<ChatNavigationKey | null>(null)
  const [selectedKey, setSelectedKey] = useState<ChatNavigationKey | null>(null)
  if (items.length === 0) return null
  const activeIndex = activeKey === null ? -1 : items.findIndex(item => item.key === activeKey)

  return (
    <nav
      className="dsh_messageJumpRail_nav"
      aria-label={t('navigator.aria')}
      onPointerLeave={() => { setActiveKey(null) }}
    >
      <div className="dsh_messageJumpRail_items">
        {items.map(({ key, kind, summary }, index) => {
          const distance = activeIndex < 0 ? undefined : Math.min(3, Math.abs(index - activeIndex))
          const kindLabel = kind === 'assistant' ? t('navigator.assistant') : t('navigator.user')
          const previewKind = kind === 'assistant' ? t('navigator.previewAssistant') : t('navigator.previewUser')
          return (
            <button
              key={key}
              type="button"
              className="dsh_messageJumpRail_item"
              data-kind={kind}
              data-distance={distance}
              data-preview-active={activeKey === key || undefined}
              data-selected={selectedKey === key || undefined}
              aria-label={`${kindLabel} — ${t('navigator.item', { summary })}`}
              aria-current={selectedKey === key || undefined}
              onPointerEnter={() => { setActiveKey(key) }}
              onFocus={() => { setActiveKey(key) }}
              onBlur={() => { setActiveKey(null) }}
              onClick={() => { setSelectedKey(key); jumpTo(key) }}
            >
              <span className="dsh_messageJumpRail_mark" aria-hidden />
              <span className="dsh_messageJumpRail_preview" aria-hidden>
                <span className="dsh_messageJumpRail_previewKind">{previewKind}</span>
                {summary}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
