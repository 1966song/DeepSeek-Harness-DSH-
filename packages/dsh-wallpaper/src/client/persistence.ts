/**
 * Wallpaper persistence. Visual preferences live in localStorage: DSH's Host
 * settings wire only exposes an allowlisted set of namespaces to browser
 * clients, so a third-party namespace would answer `settings-not-exposed`;
 * localStorage matches that boundary for visual preferences while surviving
 * reloads on the same origin.
 */

/** localStorage keys owned by this plugin. */
export const STORAGE_KEYS = {
  image: 'dsh-wallpaper:image',
  opacity: 'dsh-wallpaper:opacity',
  blur: 'dsh-wallpaper:blur',
  fit: 'dsh-wallpaper:fit',
} as const

/** Default wash opacity (0..1) applied to the translucent surfaces. */
export const DEFAULT_OPACITY = 0.8
/** Default wallpaper blur radius in px. */
export const DEFAULT_BLUR = 0
/** Default wallpaper display mode. */
export const DEFAULT_FIT = 'cover'
/** Accepted wallpaper display modes. */
export const FITS = ['cover', 'contain', 'stretch', 'tile'] as const
export type Fit = (typeof FITS)[number]

/** Soft cap for persisted data URLs (localStorage quota headroom). */
export const MAX_DATA_URL = 1_800_000

/** Read a localStorage string value (null on absence or error). */
export function readStorage(key: string): string | null {
  try {
    const value = window.localStorage.getItem(key)
    return typeof value === 'string' ? value : null
  } catch {
    return null
  }
}

/** Write (or remove with null) a localStorage value. */
export function writeStorage(key: string, value: string | null): boolean {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/** Wallpaper image URL (null when unset). */
export function readWallpaper(): string | null {
  const value = readStorage(STORAGE_KEYS.image)
  return value === null || value.length === 0 ? null : value
}

/** Wash opacity (0..1) with the default applied on absence or corruption. */
export function readOpacity(): number {
  const value = Number(readStorage(STORAGE_KEYS.opacity))
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : DEFAULT_OPACITY
}

/** Blur radius in px (0..60) with the default applied on absence or corruption. */
export function readBlur(): number {
  const value = Number(readStorage(STORAGE_KEYS.blur))
  return Number.isFinite(value) && value >= 0 && value <= 60 ? Math.round(value) : DEFAULT_BLUR
}

/** Display mode with the default applied on absence or corruption. */
export function readFit(): Fit {
  const value = readStorage(STORAGE_KEYS.fit)
  return FITS.includes(value as Fit) ? (value as Fit) : DEFAULT_FIT
}

/**
 * Accept only image-safe URLs: http(s), data:image/*, or a relative path.
 * blob: URLs die on reload and are rejected here.
 * @param raw - the raw user input.
 * @returns the sanitized URL, or null when rejected.
 */
export function sanitizeWallpaperUrl(raw: string): string | null {
  const value = String(raw ?? '').trim()
  if (value.length === 0) return null
  if (/^blob:/i.test(value)) return null
  if (/^(?:https?:|data:image\/)/i.test(value)) return value
  return null
}

/** Whether a persisted value would blow the localStorage quota headroom. */
export function dataUrlTooLarge(value: string): boolean {
  return value.startsWith('data:') && value.length > MAX_DATA_URL
}
