/**
 * dsh-desktop-shell — main process.
 *
 * Opens a frameless window with the native Windows 11 acrylic material and
 * the native Window Controls Overlay (min/max/close + drag region live in
 * the OS layer, so they can never collide with page content), spawns (or
 * attaches to) a `dsh web` server, and injects the rounded-card chrome.
 *
 * Design notes (why not transparent windows): on Windows, transparent
 * frameless windows lose the edge resize hot-spots, CSS app-region drag is
 * unreliable, and the acrylic backdrop fills the rectangle — producing the
 * "square border around rounded corners" look. The non-transparent acrylic +
 * titleBarOverlay route keeps the frosted border, native controls, native
 * drag/resize, and the system rounded corners.
 */
const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron')
const { spawn, spawnSync } = require('node:child_process')
const net = require('node:net')
const os = require('node:os')
const path = require('node:path')
const fs = require('node:fs')

/** Resolve the shell config: env vars first, then a JSON config file. */
function loadConfig() {
  // In packaged builds the app directory is read-only-ish (resources/app);
  // the config file lives in the userData directory instead.
  const configPath = process.env.DSH_DESKTOP_CONFIG ?? (
    app.isPackaged
      ? path.join(app.getPath('userData'), 'dsh-desktop.config.json')
      : path.join(__dirname, 'dsh-desktop.config.json')
  )
  let file = {}
  try {
    file = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  } catch {
    // absent or malformed config file — defaults apply
  }
  const fromEnv = (key, fallback) => (process.env[key] ?? fallback)
  return {
    configPath,
    harness: fromEnv('DSH_DESKTOP_HARNESS', file.harness ?? path.join(os.homedir(), 'deepseek-harness')),
    port: Number(fromEnv('DSH_DESKTOP_PORT', file.port ?? 3080)),
    spawnCommand: file.spawnCommand ?? 'pnpm',
    window: {
      width: file.window?.width ?? 1280,
      height: file.window?.height ?? 820,
      minWidth: file.window?.minWidth ?? 960,
      minHeight: file.window?.minHeight ?? 640,
    },
    verbose: process.argv.includes('--verbose') || file.verbose === true,
  }
}

/** Headless self-check: spawn the server, load the page, then quit. */
const SMOKE = process.argv.includes('--smoke') || process.env.DSH_DESKTOP_SMOKE === '1'

const config = loadConfig()
const log = (message) => {
  if (config.verbose) console.log(`[dsh-desktop] ${message}`)
}

/** Verbose diagnostic log file (portable stubs swallow stdout; a file always works). */
let diagLog = null
if (config.verbose && !SMOKE) {
  try {
    diagLog = fs.createWriteStream(path.join(app.getPath('userData'), 'dsh-desktop.log'), { flags: 'a' })
  } catch {
    diagLog = null
  }
}
const diag = (message) => {
  if (diagLog !== null) diagLog.write(`[${new Date().toISOString()}] ${message}\n`)
  if (config.verbose) console.log(`[dsh-desktop] ${message}`)
}

/** True when something already listens on the port (a dsh web server). */
function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' })
    const done = (ok) => { socket.destroy(); resolve(ok) }
    socket.once('connect', () => done(true))
    socket.once('error', () => done(false))
  })
}

/** Wait until the port accepts connections (or the deadline passes). */
function waitForPort(port, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  return new Promise((resolve) => {
    const probe = async () => {
      if (await isPortOpen(port)) return resolve(true)
      if (Date.now() >= deadline) return resolve(false)
      setTimeout(probe, 300)
    }
    void probe()
  })
}

/** Kill the spawned server process tree (pnpm wraps the real node child). */
function killServer() {
  if (serverProcess === null) return
  log('stopping dsh web')
  const pid = serverProcess.pid
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' })
    } else {
      serverProcess.kill('SIGTERM')
    }
  } catch {
    serverProcess.kill()
  }
  serverProcess = null
}

let serverProcess = null

/** Spawn `dsh web` in the harness checkout when the port is not served yet. */
async function ensureServer() {
  if (await isPortOpen(config.port)) {
    log(`port ${config.port} already served — attaching`)
    return
  }
  if (!fs.existsSync(path.join(config.harness, 'package.json'))) {
    log(`harness checkout not found at ${config.harness}`)
    const message = `找不到 DeepSeek Harness 源码目录：${config.harness}\n\n`
      + '请通过以下方式之一解决：\n'
      + '1. 在配置文件里设置 "harness" 指向你的 harness checkout\n'
      + `   （配置路径：${config.configPath}）\n`
      + '2. 设置环境变量 DSH_DESKTOP_HARNESS\n'
      + '3. 先手动启动 dsh web（本应用会自动连接已运行的 3080 服务）'
    if (!SMOKE) {
      const { dialog } = require('electron')
      dialog.showErrorBox('DSH Desktop 无法启动', message)
    }
    throw new Error(`harness checkout not found at ${config.harness} (set DSH_DESKTOP_HARNESS)`)
  }
  log(`spawning dsh web --port ${config.port} in ${config.harness}`)
  const command = config.spawnCommand
  const args = ['dsh', 'web', '--port', String(config.port)]
  const child = spawn(command, args, {
    cwd: config.harness,
    shell: process.platform === 'win32',
    stdio: config.verbose ? 'inherit' : 'ignore',
    windowsHide: true,
  })
  serverProcess = child
  child.on('exit', (code) => {
    log(`dsh web exited with code ${code}`)
    serverProcess = null
  })
  const ok = await waitForPort(config.port)
  if (!ok) {
    child.kill()
    throw new Error(`dsh web did not start on port ${config.port} within 60s`)
  }
  log('dsh web is listening')
}

/**
 * Styles that turn the page into a rounded card floating on the window's
 * acrylic backdrop. The 36px top strip belongs to the native Window Controls
 * Overlay (OS-drawn buttons + drag region); page content starts below it.
 */
const INJECT_CSS = `
html, body { background: transparent !important; }
#root {
  margin: 36px 16px 16px 16px;
  height: calc(100vh - 52px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.35);
}
/* Full-window wallpaper clipped to the window's rounded corners — no dark
   gutters around the card (in the browser the layer is full-window anyway;
   the shell only adds the corner clipping). */
.dsh-wallpaper-layer {
  inset: 0 !important;
  border-radius: 8px !important;
}
/* Only the "Session log" button drops below the native control strip — the
   rest of the session header row (title, mode, jobs) stays put. 20px keeps
   it clearly separated without crowding the tab row. */
[data-slot='conversation.session.header'] header [class*='sessionLogButton'] {
  margin-top: 20px !important;
}
`

/**
 * Verbose-only diagnostic: report the session header layout (slot count,
 * header padding, the Session log button's real position) so shell CSS
 * tuning can be verified against the actual DOM instead of guesses.
 */
const INJECT_LAYOUT_DEBUG = `
(() => {
  const report = () => {
    const slots = document.querySelectorAll('[data-slot="conversation.session.header"]');
    console.log('[dsh-desktop:layout] headerSlots=' + slots.length);
    slots.forEach((slot, i) => {
      const header = slot.querySelector(':scope > header');
      if (header === null) { console.log('[dsh-desktop:layout] slot' + i + ' no header'); return }
      const cs = getComputedStyle(header);
      const rect = header.getBoundingClientRect();
      console.log('[dsh-desktop:layout] slot' + i + ' header paddingTop=' + cs.paddingTop + ' rectTop=' + Math.round(rect.top) + ' height=' + Math.round(rect.height));
      const btn = [...header.querySelectorAll('button')].find(b => /session ?log/i.test(b.textContent || ''));
      if (btn !== undefined) {
        const r = btn.getBoundingClientRect();
        console.log('[dsh-desktop:layout] sessionLogBtn top=' + Math.round(r.top) + ' bottom=' + Math.round(r.bottom));
      } else {
        console.log('[dsh-desktop:layout] sessionLogBtn not found in header');
      }
    });
  };
  report();
  const timer = setInterval(report, 2000);
  setTimeout(() => clearInterval(timer), 60_000);
})();
`

/**
 * Verbose-only diagnostic: report the real computed geometry of every
 * full-viewport dialog as it mounts, so shell CSS tuning can be verified
 * against the actual DOM instead of guesses.
 */
const INJECT_MODAL_DEBUG = `
(() => {
  const report = (el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    console.log('[dsh-desktop:modal]', 'role=' + el.getAttribute('role'), 'top=' + Math.round(rect.top), 'computedTop=' + style.top, 'position=' + style.position, 'inset=' + style.inset);
  };
  const scan = () => { document.querySelectorAll('div[role="presentation"]').forEach(report) };
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();
})();
`

let mainWindow = null
let tray = null
/** Renderer console lines collected during the smoke run. */
const smokeConsole = []

function createWindow() {
  mainWindow = new BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    minWidth: config.window.minWidth,
    minHeight: config.window.minHeight,
    frame: false,
    // Native min/max/close + drag region drawn by the OS over the top strip
    // (Windows; falls back to nothing on other platforms).
    titleBarStyle: 'hidden',
    titleBarOverlay: process.platform === 'win32'
      ? { color: '#00000000', symbolColor: '#ffffff', height: 36 }
      : undefined,
    // System frosted backdrop (Windows 11 22H2+): the window margins and the
    // native title bar show the desktop through acrylic — the frosted border.
    backgroundMaterial: process.platform === 'win32' ? 'acrylic' : undefined,
    // Fallback when the OS material is unavailable (Win10): deep neutral.
    backgroundColor: '#0d1017',
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  })

  mainWindow.loadURL(`http://127.0.0.1:${config.port}/`)

  if (SMOKE) {
    mainWindow.webContents.on('console-message', (_event, level, message) => {
      smokeConsole.push(`[level=${level}] ${message}`)
    })
  } else if (config.verbose) {
    // Forward renderer console (the modal diagnostics) to the log file.
    mainWindow.webContents.on('console-message', (_event, level, message) => {
      diag(`[renderer level=${level}] ${message}`)
    })
  }

  mainWindow.once('ready-to-show', () => {
    if (SMOKE) mainWindow.hide()
    else mainWindow.show()
  })
  mainWindow.webContents.on('did-finish-load', () => {
    // insertCSS is async; diagnostics and the smoke probe must run after it
    // settles or they see a stylesheet without the injected rules.
    mainWindow.webContents.insertCSS(INJECT_CSS).catch(() => {}).finally(() => {
      if (config.verbose) {
        mainWindow.webContents.executeJavaScript(INJECT_MODAL_DEBUG).catch(() => {})
        mainWindow.webContents.executeJavaScript(INJECT_LAYOUT_DEBUG).catch(() => {})
      }
      if (SMOKE) {
        // Probe that the injected rules actually apply, verified through
        // computed styles on matching elements (document.styleSheets cannot
        // see Electron's adopted-style-sheet injection).
        mainWindow.webContents.executeJavaScript(`(() => {
          const wallpaper = document.createElement('div');
          wallpaper.className = 'dsh-wallpaper-layer';
          const slot = document.createElement('div');
          slot.setAttribute('data-slot', 'conversation.session.header');
          const header = document.createElement('header');
          const button = document.createElement('button');
          button.className = 'x_sessionLogButton_y';
          header.appendChild(button);
          slot.appendChild(header);
          document.body.appendChild(wallpaper);
          document.body.appendChild(slot);
          const wallpaperInset = getComputedStyle(wallpaper).inset;
          const headerPaddingTop = getComputedStyle(header).paddingTop;
          const buttonMarginTop = getComputedStyle(button).marginTop;
          wallpaper.remove();
          slot.remove();
          return { root: document.getElementById('root') !== null, wallpaperInset, headerPaddingTop, buttonMarginTop };
        })()`).then((probe) => {
          const loaderErrors = smokeConsole.filter((line) => line.includes('client-modules') || line.includes('failed to import loader entry'))
          console.log(`[dsh-desktop:smoke] probe=${JSON.stringify(probe)}`)
          console.log(`[dsh-desktop:smoke] loaderErrors=${loaderErrors.length}`)
          for (const line of loaderErrors.slice(0, 5)) console.log(`[dsh-desktop:smoke] ${line}`)
          // Persist the probe for headless inspection (GUI stdout is unreliable).
          try {
            fs.writeFileSync(path.join(app.getPath('userData'), 'dsh-smoke.json'), JSON.stringify({ probe, loaderErrors }, null, 2))
          } catch { /* best effort */ }
          setTimeout(() => {
            // Wallpaper full-window; the header row must NOT be pushed down
            // (paddingTop stays 0 on the synthetic header), and only the
            // Session log button gets its 20px drop.
            const ok = probe.root === true && probe.wallpaperInset === '0px' && probe.headerPaddingTop === '0px' && probe.buttonMarginTop === '20px' && loaderErrors.length === 0
            if (ok) app.quit()
            else app.exit(1)
          }, 500)
        }).catch((error) => {
          console.error(`[dsh-desktop:smoke] ${String(error)}`)
          app.exit(1)
        })
      }
    })
  })
  mainWindow.on('closed', () => { mainWindow = null })
}

function createTray() {
  // 1x1 transparent icon: the tray shows the window title text (Windows).
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)
  tray.setToolTip('DeepSeek Harness')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '显示窗口', click: () => { if (mainWindow === null) createWindow(); else mainWindow.show() } },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]))
  tray.on('double-click', () => { mainWindow?.show() })
}

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow === null) createWindow()
    else { mainWindow.show(); mainWindow.focus() }
  })

  app.whenReady().then(async () => {
    try {
      await ensureServer()
      createWindow()
      createTray()
    } catch (error) {
      console.error(`[dsh-desktop] ${error instanceof Error ? error.message : String(error)}`)
      app.quit()
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    // Keep running in the tray.
  })

  app.on('before-quit', () => {
    killServer()
  })
}
