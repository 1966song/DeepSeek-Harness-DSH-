/** Product copy for the usage widget and dashboard panel. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'usage.actionLabel': '用量',
  'usage.actionAria': '打开用量统计',
  'usage.panelTitle': '用量统计',
  'usage.refresh': '刷新',
  'usage.close': '关闭',
  'usage.loading': '统计中…',
  'usage.error': '加载失败：{message}',
  'usage.balance': '余额',
  'usage.balanceUnavailable': '未配置 API Key',
  'usage.balanceError': '余额查询失败',
  'usage.totalTokens': '总消耗',
  'usage.estimatedCost': '估算费用',
  'usage.cacheHitRate': '缓存命中率',
  'usage.sessions': '会话数',
  'usage.lastDays': '近 30 天消耗（每日总 token）',
  'usage.sessionTable': '会话明细',
  'usage.session.input': '输入',
  'usage.session.cache': '缓存读',
  'usage.session.output': '输出',
  'usage.session.updated': '更新',
  'usage.session.cost': '费用',
  'usage.empty': '暂无用量记录',
  'usage.note.pricing': '费用按官方价目表估算（输入 ¥{input}/M，缓存命中 ¥{cacheRead}/M，缓存写入 ¥{cacheWrite}/M，输出 ¥{output}/M），仅作参考',
  'usage.note.balance': '余额由本机 dsh-usage 路由通过 DeepSeek 官方余额接口查询，API Key 不离开本机',
  'usage.note.source': '数据来自本机会话日志（已折叠的旧记录不参与统计）',
} as const

/** English dictionary mirroring the Chinese key set. */
export const en: Record<keyof typeof zh, string> = {
  'usage.actionLabel': 'Usage',
  'usage.actionAria': 'Open usage statistics',
  'usage.panelTitle': 'Usage statistics',
  'usage.refresh': 'Refresh',
  'usage.close': 'Close',
  'usage.loading': 'Loading…',
  'usage.error': 'Failed to load: {message}',
  'usage.balance': 'Balance',
  'usage.balanceUnavailable': 'No API key configured',
  'usage.balanceError': 'Balance lookup failed',
  'usage.totalTokens': 'Total tokens',
  'usage.estimatedCost': 'Estimated cost',
  'usage.cacheHitRate': 'Cache hit rate',
  'usage.sessions': 'Sessions',
  'usage.lastDays': 'Last 30 days (tokens per day)',
  'usage.sessionTable': 'Session details',
  'usage.session.input': 'Input',
  'usage.session.cache': 'Cache read',
  'usage.session.output': 'Output',
  'usage.session.updated': 'Updated',
  'usage.session.cost': 'Cost',
  'usage.empty': 'No usage records yet',
  'usage.note.pricing': 'Cost is estimated with the official price list (input ¥{input}/M, cache hit ¥{cacheRead}/M, cache write ¥{cacheWrite}/M, output ¥{output}/M); reference only',
  'usage.note.balance': 'Balance is queried by the local dsh-usage route via the official DeepSeek balance API; the API key never leaves this machine',
  'usage.note.source': 'Data comes from local session logs (compacted history is not included)',
} as const

/** Plugin locale namespace (declared for typed `t` seats). */
export const NS = 'usage'
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** This plugin's usage dashboard copy. */
    [NS]: keyof typeof zh
  }
}
