/**
 * Wallpaper settings row store: a mirror of the persisted settings. The
 * plugin's apply-world sync is the only writer; the row component reads via
 * the standard-kit useStore selector hook.
 */
import { defineStore } from '@deepseek-ai/dsh-client-runtime/client'
import { DEFAULT_BLUR, DEFAULT_FIT, DEFAULT_OPACITY, type Fit } from './persistence.ts'

/** Row state mirroring the persisted wallpaper settings. */
export interface WallpaperRowState {
  /** Current wallpaper URL (null when unset). */
  url: string | null
  /** Wash opacity (0..1). */
  opacity: number
  /** Blur radius in px. */
  blur: number
  /** Display mode. */
  fit: Fit
  /** Last error code (locale key suffix), null when clean. */
  error: string | null
  /** Monotonic sync counter guarding against out-of-order writes. */
  revision: number
}

/** The row's store seat (state + draft-transform actions). */
export const wallpaperStore = defineStore({
  init: (): WallpaperRowState => ({
    url: null,
    opacity: DEFAULT_OPACITY,
    blur: DEFAULT_BLUR,
    fit: DEFAULT_FIT,
    error: null,
    revision: -1,
  }),
  actions: {
    sync(draft, url: string | null, opacity: number, blur: number, fit: Fit, error: string | null, revision: number): void {
      if (revision <= draft.revision) return
      draft.url = url
      draft.opacity = opacity
      draft.blur = blur
      draft.fit = fit
      draft.error = error
      draft.revision = revision
    },
  },
})
