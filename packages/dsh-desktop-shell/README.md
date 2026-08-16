# dsh-desktop-shell

Electron 桌面壳 for DeepSeek Harness web（**dsh web**）：透明圆角窗口、四周原生毛玻璃边框（Windows 11 acrylic）、内嵌拉起 dsh web、自定义标题栏与系统托盘。

## 效果

- **窗口级毛玻璃**：无边框透明窗口 + `backgroundMaterial: 'acrylic'`（Windows 11）——窗口四周的边距与圆角透出桌面原生磨砂，正中是圆角应用卡片
- **内嵌服务器**：启动时自动在 harness checkout 里拉起 `pnpm dsh web --port 3080`（端口已被占用则直接连接），退出时一并停掉
- **自定义标题栏**：顶部 44px 边距作为拖拽区，右上角提供最小化 / 最大化 / 关闭按钮（注入页面）
- **系统托盘**：关闭窗口后驻留托盘，双击恢复
- 界面内毛玻璃（壁纸 + 面板磨砂）由同仓库的 dsh-wallpaper 插件提供，两者叠加效果最佳

## 运行

```powershell
cd <repo-root>\packages\dsh-desktop-shell
pnpm install
pnpm start
```

## 打包分发

```powershell
pnpm run dist             # NSIS 安装包 + portable 免安装版（dist/）
pnpm run dist:nsis        # 仅安装包
pnpm run dist:portable    # 仅免安装版
```

产物（`dist/`）：

- `DSH-Desktop-<版本>-x64.exe` —— NSIS 安装包（可选安装目录、桌面/开始菜单快捷方式）
- `DSH-Desktop-<版本>-portable.exe` —— 免安装版（解压即用）
- `win-unpacked/` —— 未打包运行目录（开发调试用）

**打包特性**：`asar: false`（`resources/app` 是裸目录，改壳代码可直接编辑重启）；未混淆压缩；`--smoke` 自检、F12 DevTools、`--inspect` 调试通道全部保留。工具链走 npmmirror 镜像（`ELECTRON_MIRROR` / `ELECTRON_BUILDER_BINARIES_MIRROR`），已实测可完整出包。

**分发注意**：壳启动时会找 harness checkout（`DSH_DESKTOP_HARNESS`）拉起 dsh web；找不到时弹窗提示，且 3080 已有服务时直接连接（无需本地 checkout 也能用——前提是对方有自己的 dsh web）。

## 配置

| 方式 | 键 | 默认 |
|---|---|---|
| 环境变量 | `DSH_DESKTOP_HARNESS` | `%USERPROFILE%\deepseek-harness` |
| 环境变量 | `DSH_DESKTOP_PORT` | `3080` |
| 环境变量 | `DSH_DESKTOP_CONFIG` | 应用目录下的 `dsh-desktop.config.json` |
| 配置文件 | `harness` / `port` / `window.*` / `spawnCommand` / `verbose` | 同上 |

## 已知限制

- **Windows 10 无 acrylic**：边距仍透明（透出桌面但不模糊），圆角卡片效果保留
- 透明无边框窗口不参与 Windows 11 贴靠布局（snap layouts）；最大化时内容卡片仍保留边距
- Chromium 的 `backdrop-filter` 采样不到桌面，因此桌面磨砂必须走系统材质，界面内磨砂才用 CSS

## License

MIT
