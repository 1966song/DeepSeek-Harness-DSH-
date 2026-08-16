/** Product copy for the usage widget and dashboard panel. */
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'usage.actionLabel': "用量";
    readonly 'usage.actionAria': "打开用量统计";
    readonly 'usage.panelTitle': "用量统计";
    readonly 'usage.refresh': "刷新";
    readonly 'usage.close': "关闭";
    readonly 'usage.loading': "统计中…";
    readonly 'usage.error': "加载失败：{message}";
    readonly 'usage.balance': "余额";
    readonly 'usage.balanceUnavailable': "未配置 API Key";
    readonly 'usage.balanceError': "余额查询失败";
    readonly 'usage.totalTokens': "总消耗";
    readonly 'usage.estimatedCost': "估算费用";
    readonly 'usage.cacheHitRate': "缓存命中率";
    readonly 'usage.sessions': "会话数";
    readonly 'usage.lastDays': "近 30 天消耗（每日总 token）";
    readonly 'usage.sessionTable': "会话明细";
    readonly 'usage.session.input': "输入";
    readonly 'usage.session.cache': "缓存读";
    readonly 'usage.session.output': "输出";
    readonly 'usage.session.updated': "更新";
    readonly 'usage.session.cost': "费用";
    readonly 'usage.empty': "暂无用量记录";
    readonly 'usage.note.pricing': "费用按官方价目表估算（输入 ¥{input}/M，缓存命中 ¥{cacheRead}/M，缓存写入 ¥{cacheWrite}/M，输出 ¥{output}/M），仅作参考";
    readonly 'usage.note.balance': "余额由本机 dsh-usage 路由通过 DeepSeek 官方余额接口查询，API Key 不离开本机";
    readonly 'usage.note.source': "数据来自本机会话日志（已折叠的旧记录不参与统计）";
};
/** English dictionary mirroring the Chinese key set. */
export declare const en: Record<keyof typeof zh, string>;
/** Plugin locale namespace (declared for typed `t` seats). */
export declare const NS = "usage";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** This plugin's usage dashboard copy. */
        [NS]: keyof typeof zh;
    }
}
