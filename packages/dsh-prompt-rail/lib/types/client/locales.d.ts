/** Product copy for the message-jump rail. */
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'navigator.aria': "消息跳转";
    readonly 'navigator.item': "跳转到消息：{summary}";
    readonly 'navigator.user': "用户";
    readonly 'navigator.assistant': "助手";
    readonly 'navigator.previewUser': "用户消息";
    readonly 'navigator.previewAssistant': "助手消息";
};
/** English dictionary mirroring the Chinese key set. */
export declare const en: Record<keyof typeof zh, string>;
/** Plugin locale namespace (declared for typed `t` seats). */
export declare const NS = "message-jump-rail";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** This plugin's message navigation copy. */
        [NS]: keyof typeof zh;
    }
}
