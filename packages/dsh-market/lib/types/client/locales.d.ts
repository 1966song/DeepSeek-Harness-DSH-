/** Product copy for the plugin marketplace panel. */
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'market.actionLabel': "市场";
    readonly 'market.actionAria': "打开插件市场";
    readonly 'market.panelTitle': "插件市场";
    readonly 'market.refresh': "刷新";
    readonly 'market.close': "关闭";
    readonly 'market.loading': "加载中…";
    readonly 'market.error': "加载失败：{message}";
    readonly 'market.repo': "插件仓库";
    readonly 'market.repoMissing': "未配置插件仓库（设置环境变量 DSH_MARKET_REPO）";
    readonly 'market.installed': "已安装";
    readonly 'market.install': "安装";
    readonly 'market.uninstall': "卸载";
    readonly 'market.notBuilt': "缺少构建产物";
    readonly 'market.empty': "仓库中暂无插件";
    readonly 'market.urlPlaceholder': "Git 仓库地址（https://…）";
    readonly 'market.urlInstall': "安装";
    readonly 'market.urlInvalid': "请输入 https:// 开头的地址";
    readonly 'market.restartHint': "安装或卸载后需重启 dsh web 才生效";
    readonly 'market.autobuildHint': "缺少构建产物的插件，安装时会自动执行 pnpm install 和构建（可能需要几分钟）";
    readonly 'market.busy': "处理中…";
};
/** English dictionary mirroring the Chinese key set. */
export declare const en: Record<keyof typeof zh, string>;
/** Plugin locale namespace (declared for typed `t` seats). */
export declare const NS = "market";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** This plugin's marketplace copy. */
        [NS]: keyof typeof zh;
    }
}
