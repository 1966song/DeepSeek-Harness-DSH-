/** Product copy for the wallpaper settings row. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'wallpaper.title': '壁纸',
  'wallpaper.choose': '选择图片',
  'wallpaper.remove': '移除',
  'wallpaper.urlPlaceholder': '或粘贴图片网址（http(s) / data）',
  'wallpaper.urlApply': '应用',
  'wallpaper.urlInvalid': '请使用 http(s) 或 data 图片地址（不要用 blob）',
  'wallpaper.fit': '显示方式',
  'wallpaper.fit.cover': '铺满',
  'wallpaper.fit.contain': '完整显示',
  'wallpaper.fit.stretch': '拉伸',
  'wallpaper.fit.tile': '平铺',
  'wallpaper.opacity': '面板不透明度',
  'wallpaper.blur': '模糊',
  'wallpaper.errorTooLarge': '图片太大，存不下',
  'wallpaper.errorRead': '无法读取这张图片',
  'wallpaper.errorSave': '保存失败（存储空间不足或浏览器限制）',
  'wallpaper.errorBlob': 'blob 地址刷新后会失效，请使用 http(s) 或选择本地图片',
  'wallpaper.errorDead': '壁纸地址已失效，已清除',
  'wallpaper.hint': '壁纸显示在主内容区和侧边栏之后；面板半透明配合模糊形成毛玻璃效果，消息气泡保持不透明以保证可读性',
} as const

/** English dictionary mirroring the Chinese key set. */
export const en: Record<keyof typeof zh, string> = {
  'wallpaper.title': 'Wallpaper',
  'wallpaper.choose': 'Choose image',
  'wallpaper.remove': 'Remove',
  'wallpaper.urlPlaceholder': 'Or paste an image URL (http(s) / data)',
  'wallpaper.urlApply': 'Apply',
  'wallpaper.urlInvalid': 'Use an http(s) or data image URL (not blob)',
  'wallpaper.fit': 'Fit',
  'wallpaper.fit.cover': 'Cover',
  'wallpaper.fit.contain': 'Contain',
  'wallpaper.fit.stretch': 'Stretch',
  'wallpaper.fit.tile': 'Tile',
  'wallpaper.opacity': 'UI wash',
  'wallpaper.blur': 'Blur',
  'wallpaper.errorTooLarge': 'Image is too large to save',
  'wallpaper.errorRead': 'Could not read that image',
  'wallpaper.errorSave': 'Could not save (storage full or blocked)',
  'wallpaper.errorBlob': 'blob URLs die on reload — use http(s) or pick a local image',
  'wallpaper.errorDead': 'Wallpaper URL was invalid and was cleared',
  'wallpaper.hint': 'The wallpaper sits behind the main canvas and sidebar; translucent panels with blur form the frosted-glass look, while message bubbles stay opaque for readability',
} as const

/** Plugin locale namespace (declared for typed `t` seats). */
export const NS = 'settings.wallpaper'
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** This plugin's wallpaper settings copy. */
    [NS]: keyof typeof zh
  }
}
