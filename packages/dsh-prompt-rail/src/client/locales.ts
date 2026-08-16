/** Product copy for the message-jump rail. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'navigator.aria': '消息跳转',
  'navigator.item': '跳转到消息：{summary}',
  'navigator.user': '用户',
  'navigator.assistant': '助手',
  'navigator.previewUser': '用户消息',
  'navigator.previewAssistant': '助手消息',
} as const

/** English dictionary mirroring the Chinese key set. */
export const en: Record<keyof typeof zh, string> = {
  'navigator.aria': 'Message navigation',
  'navigator.item': 'Jump to message: {summary}',
  'navigator.user': 'User',
  'navigator.assistant': 'Assistant',
  'navigator.previewUser': 'User message',
  'navigator.previewAssistant': 'Assistant message',
} as const

/** Plugin locale namespace (declared for typed `t` seats). */
export const NS = 'message-jump-rail'
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** This plugin's message navigation copy. */
    [NS]: keyof typeof zh
  }
}
