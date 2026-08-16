# dsh-wallpaper

Wallpaper + frosted-glass visuals for the DeepSeek Harness web UI (dsh web).

- 整页壁纸：选本地图片（自动压缩为 data URL）或粘贴 http(s)/data 图片网址
- 毛玻璃联动：面板不透明度（wash）与模糊（blur）滑块，主画布/侧边栏半透明，图片透出；消息气泡保持不透明保证可读
- 显示方式：铺满 / 完整显示 / 拉伸 / 平铺
- 设置入口：设置 → 通用 → 壁纸
- 持久化：localStorage（第三方设置 namespace 不在 host allowlist 内，与 dsh-skin 同策略）

## 安装

```powershell
cd <repo-root>\packages\dsh-wallpaper
pnpm run check        # typecheck + build（产出 lib/）
# 在 DeepSeek Harness 根目录：
pnpm dsh plugin --profile web add "<repo-root>\packages\dsh-wallpaper"
```

重启 dsh web 后浏览器 Ctrl+F5 强刷。

## 实现说明

- Host 半：`dsh.bundle` patch 层插入一个 loader entry（`cordis.patch.yml`）
- 浏览器半：`dsh.client` bundle，`apply(ctx)` 中：
  1. `WallpaperController` 维护一个 `position:fixed; z-index:-1` 的背景层
  2. `ctx.theme.overrideTokens` 把 `--dsw-alias-bg-base` 与 `--dsw-specific-sidebar-fill` 变为半透明（wash），实现毛玻璃透出
  3. 注册 `settings.general.item` 设置行（store + inject + locale 三件套）

参考实现（MIT）：[KinGao294/dsh-skin](https://github.com/KinGao294/dsh-skin)（token 覆盖法）、[lyh9712/dsh-bg-image](https://github.com/lyh9712/dsh-bg-image)。

## License

MIT
