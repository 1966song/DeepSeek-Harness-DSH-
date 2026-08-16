/**
 * Browser entry: mount the wallpaper layer from persisted settings, keep the
 * token shading in sync with theme changes, and register the wallpaper row
 * into Settings → General.
 */
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { NS, en, zh } from './locales.ts'
import { MAX_DATA_URL, readBlur, readFit, readOpacity, readWallpaper, sanitizeWallpaperUrl, dataUrlTooLarge, writeStorage, STORAGE_KEYS, type Fit } from './persistence.ts'
import { wallpaperStore, type WallpaperRowState } from './store.ts'
import { WallpaperController } from './wallpaper.ts'
import { WallpaperRow, type WallpaperInjected } from './WallpaperRow.tsx'

/** Client services needed to add one settings row and its localized copy. */
export const inject = ['slots', 'locale', 'theme']

/**
 * Mount the browser contribution.
 * @param ctx - Client context for the installed plugin.
 */
export function apply(ctx: ClientContext): void {
  const controller = new WallpaperController()

  // One monotonic revision per persisted-snapshot push; the row ignores stale
  // out-of-order syncs.
  let revision = 0
  let error: string | null = null
  const store = wallpaperStore
  let bound: BoundActions<typeof wallpaperStore> | undefined

  const syncRow = () => {
    revision += 1
    bound?.sync(readWallpaper(), readOpacity(), readBlur(), readFit(), error, revision)
  }

  /** rAF-coalesced wallpaper re-apply (slider ticks never re-decode images). */
  let applyRaf: number | null = null
  const scheduleApply = () => {
    if (applyRaf !== null) return
    applyRaf = requestAnimationFrame(() => {
      applyRaf = null
      controller.apply(ctx)
    })
  }

  // Restore the saved wallpaper on boot and re-shade when the active theme
  // (light/dark or a third-party skin) changes the base color.
  controller.apply(ctx)
  syncRow()
  ctx.on('theme/change', () => {
    if (readWallpaper() !== null) scheduleApply()
  })

  ctx.effect(() => () => {
    controller.dispose()
    if (applyRaf !== null) cancelAnimationFrame(applyRaf)
  }, 'dsh-wallpaper: layer cleanup')

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-wallpaper: dictionaries')

  const injected = (actions: BoundActions<typeof wallpaperStore>): WallpaperInjected => {
    bound = actions
    syncRow()
    return {
      setWallpaper: (url) => {
        if (url === null) {
          writeStorage(STORAGE_KEYS.image, null)
          error = null
          syncRow()
          scheduleApply()
          return
        }
        const sanitized = sanitizeWallpaperUrl(url)
        if (sanitized === null) {
          error = /^blob:/i.test(String(url).trim()) ? 'blob' : 'invalid'
          syncRow()
          return
        }
        if (dataUrlTooLarge(sanitized)) {
          error = 'tooLarge'
          syncRow()
          return
        }
        if (!writeStorage(STORAGE_KEYS.image, sanitized)) {
          error = 'save'
          syncRow()
          return
        }
        error = null
        syncRow()
        scheduleApply()
      },
      setOpacity: (percent) => {
        const value = Math.min(1, Math.max(0, percent / 100))
        if (!writeStorage(STORAGE_KEYS.opacity, String(value))) {
          error = 'save'
          syncRow()
          return
        }
        syncRow()
        scheduleApply()
      },
      setBlur: (px) => {
        const value = Math.min(60, Math.max(0, Math.round(px)))
        if (!writeStorage(STORAGE_KEYS.blur, String(value))) {
          error = 'save'
          syncRow()
          return
        }
        syncRow()
        scheduleApply()
      },
      setFit: (fit) => {
        if (!writeStorage(STORAGE_KEYS.fit, fit)) {
          error = 'save'
          syncRow()
          return
        }
        syncRow()
        scheduleApply()
      },
      setError: (code) => {
        error = code
        syncRow()
      },
    }
  }

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'wallpaper',
    order: 30,
    store,
    locale: NS,
    inject: injected,
  }, WallpaperRow))
}

export type { WallpaperRowState } from './store.ts'
