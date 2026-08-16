/** Product copy for the wallpaper settings row. */
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'wallpaper.title': "壁纸";
    readonly 'wallpaper.choose': "选择图片";
    readonly 'wallpaper.remove': "移除";
    readonly 'wallpaper.urlPlaceholder': "或粘贴图片网址（http(s) / data）";
    readonly 'wallpaper.urlApply': "应用";
    readonly 'wallpaper.urlInvalid': "请使用 http(s) 或 data 图片地址（不要用 blob）";
    readonly 'wallpaper.fit': "显示方式";
    readonly 'wallpaper.fit.cover': "铺满";
    readonly 'wallpaper.fit.contain': "完整显示";
    readonly 'wallpaper.fit.stretch': "拉伸";
    readonly 'wallpaper.fit.tile': "平铺";
    readonly 'wallpaper.opacity': "面板不透明度";
    readonly 'wallpaper.blur': "模糊";
    readonly 'wallpaper.errorTooLarge': "图片太大，存不下";
    readonly 'wallpaper.errorRead': "无法读取这张图片";
    readonly 'wallpaper.errorSave': "保存失败（存储空间不足或浏览器限制）";
    readonly 'wallpaper.errorBlob': "blob 地址刷新后会失效，请使用 http(s) 或选择本地图片";
    readonly 'wallpaper.errorDead': "壁纸地址已失效，已清除";
    readonly 'wallpaper.hint': "壁纸显示在主内容区和侧边栏之后；面板半透明配合模糊形成毛玻璃效果，消息气泡保持不透明以保证可读性";
};
/** English dictionary mirroring the Chinese key set. */
export declare const en: Record<keyof typeof zh, string>;
/** Plugin locale namespace (declared for typed `t` seats). */
export declare const NS = "settings.wallpaper";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** This plugin's wallpaper settings copy. */
        [NS]: keyof typeof zh;
    }
}
