/** Product copy for the plugin marketplace panel. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'market.actionLabel': '市场',
  'market.actionAria': '打开插件市场',
  'market.panelTitle': '插件市场',
  'market.refresh': '刷新',
  'market.close': '关闭',
  'market.loading': '加载中…',
  'market.error': '加载失败：{message}',
  'market.repo': '插件仓库',
  'market.repoMissing': '未配置插件仓库（设置环境变量 DSH_MARKET_REPO）',
  'market.installed': '已安装',
  'market.install': '安装',
  'market.uninstall': '卸载',
  'market.notBuilt': '缺少构建产物',
  'market.empty': '仓库中暂无插件',
  'market.urlPlaceholder': 'Git 仓库地址（https://…）',
  'market.urlInstall': '安装',
  'market.urlInvalid': '请输入 https:// 开头的地址',
  'market.restartHint': '安装或卸载后需重启 dsh web 才生效',
  'market.autobuildHint': '缺少构建产物的插件，安装时会自动执行 pnpm install 和构建（可能需要几分钟）',
  'market.busy': '处理中…',
} as const

/** English dictionary mirroring the Chinese key set. */
export const en: Record<keyof typeof zh, string> = {
  'market.actionLabel': 'Market',
  'market.actionAria': 'Open plugin marketplace',
  'market.panelTitle': 'Plugin marketplace',
  'market.refresh': 'Refresh',
  'market.close': 'Close',
  'market.loading': 'Loading…',
  'market.error': 'Failed to load: {message}',
  'market.repo': 'Plugin repository',
  'market.repoMissing': 'No plugin repository configured (set DSH_MARKET_REPO)',
  'market.installed': 'Installed',
  'market.install': 'Install',
  'market.uninstall': 'Uninstall',
  'market.notBuilt': 'No built artifacts',
  'market.empty': 'No plugins in the repository',
  'market.urlPlaceholder': 'Git repository URL (https://…)',
  'market.urlInstall': 'Install',
  'market.urlInvalid': 'Use a URL starting with https://',
  'market.restartHint': 'Installing or uninstalling takes effect after restarting dsh web',
  'market.autobuildHint': 'Plugins without built artifacts are auto-built on install (pnpm install + build; may take a few minutes)',
  'market.busy': 'Working…',
} as const

/** Plugin locale namespace (declared for typed `t` seats). */
export const NS = 'market'
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** This plugin's marketplace copy. */
    [NS]: keyof typeof zh
  }
}
