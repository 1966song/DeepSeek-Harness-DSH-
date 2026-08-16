# dsh-plugin-suite

DeepSeek Harness（DSH）插件套件 — 一个仓库、多个独立插件包。

| 包 | 功能 | 状态 |
|---|---|---|
| [packages/dsh-wallpaper](packages/dsh-wallpaper) | 壁纸 + 界面内毛玻璃（面板半透明/模糊） | ✅ 已实现并验证 |
| [packages/dsh-usage](packages/dsh-usage) | 用量统计：侧边栏入口 + 看板（按日/按会话/费用估算/真实余额，15s 缓存 + 启动预热） | ✅ 已实现并验证 |
| [packages/dsh-prompt-rail](packages/dsh-prompt-rail) | 对话消息跳转条（含 harness 导航槽补丁） | ✅ 已实现并验证 |
| [packages/dsh-market](packages/dsh-market) | 插件市场：侧边栏入口（用量上方），浏览/一键安装/卸载（host 侧路由 + git URL 安装） | ✅ 已实现并验证 |
| [packages/dsh-desktop-shell](packages/dsh-desktop-shell) | Electron 桌面壳：透明圆角窗口 + Windows 11 acrylic 毛玻璃边框 | ✅ 已实现并验证 |

## 架构

- **安装**：`scripts/install-plugin.mjs <package-dir>` 把构建产物拷入
  `$DSH_HOME/profiles/node_modules/@local/<name>/` 并在
  `$DSH_HOME/profiles/web/cordis.patch.yml` 追加 insert——不经过 pnpm/registry
- **开发循环**：`packages/<pkg>/pnpm run check`（typecheck + build）→
  安装脚本 → 用 `pnpm dsh web --port 3081`（harness checkout）起验证实例，
  不动 3080 主 GUI
- **一键生效（主 GUI）**：`scripts\install-and-restart.bat [Harness root]`
  ——安全停掉 3080 上的 dsh web、装全部插件、重启并打开页面（Ctrl+F5 强刷）
- **类型**：各包 tsconfig 的 `paths` 直接指向 harness checkout 的预构建
  `lib/types`（运行时在 profile 中解析，二者版本一致）

## 开发

```powershell
pnpm install          # workspace 工具链（esbuild/typescript/electron）
pnpm build            # 构建所有包
pnpm -C packages\dsh-wallpaper run check   # 单包检查
```

## 注意事项

- 消息条需要给 harness 内核打补丁（`conversation.chat.navigator` 槽位）：
  `packages/dsh-prompt-rail/compat/patches/harness-navigator-slot.patch`，
  已应用到当前 checkout（47f943859b）并重建 ui-conversation bundle
- 更新 harness 版本后需重新打补丁并复查（补丁工件会随仓库维护）
