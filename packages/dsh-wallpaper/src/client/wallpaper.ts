/**
 * Wallpaper layer + token shading. One fixed backdrop element is kept in the
 * body (z-index -1) and the theme runtime gets an override layer that makes
 * the main canvas and the sidebar translucent at the configured wash, so the
 * image shows through while inner surfaces stay opaque and readable.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'
import { readBlur, readFit, readOpacity, readWallpaper, type Fit } from './persistence.ts'

/** Source identity for the wallpaper's token override layer. */
const OVERRIDE_SOURCE = 'dsh-wallpaper'

/** Built-in base colors used when the active theme overrides no bg-base. */
const BUILTIN_BASE: Record<'light' | 'dark', string> = {
  light: 'rgb(255, 255, 255)',
  dark: 'rgb(21, 21, 23)',
}

/** Parse a hex or rgb()/rgba() color into rgba() with the given alpha. */
export function toRgba(color: string, alpha: number): string {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim())
  if (hex !== null) {
    let digits = hex[1]
    if (digits.length === 3) digits = digits.split('').map((char) => char + char).join('')
    const n = parseInt(digits, 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(color.trim())
  if (rgb !== null) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`
  return color.trim()
}

/** Map a fit mode onto the CSS background-* trio. */
function backgroundStyle(fit: Fit): { size: string; repeat: string; position: string } {
  if (fit === 'contain') return { size: 'contain', repeat: 'no-repeat', position: 'center' }
  if (fit === 'stretch') return { size: '100% 100%', repeat: 'no-repeat', position: 'center' }
  if (fit === 'tile') return { size: 'auto', repeat: 'repeat', position: 'left top' }
  return { size: 'cover', repeat: 'no-repeat', position: 'center' }
}

/**
 * Owns the wallpaper DOM element and the theme override layer for one plugin
 * instance. All reads go through the persistence module; callers re-apply
 * after any change (sliders are rAF-coalesced by the caller).
 */
export class WallpaperController {
  private el: HTMLDivElement | null = null
  private disposeOverride: (() => void) | null = null
  private lastSignature: string | null = null
  private applying = false

  /**
   * Render (or clear) the wallpaper layer and its token shading from the
   * current persisted settings.
   * @param ctx - client context (theme service access).
   */
  apply(ctx: ClientContext): void {
    if (this.applying) return
    if (typeof document === 'undefined' || document.body === null) return
    this.applying = true
    try {
      const url = readWallpaper()
      if (url === null) {
        this.clear()
        return
      }
      const fit = readFit()
      const blur = readBlur()
      const nextFilter = blur > 0 ? `blur(${blur}px)` : 'none'
      const signature = `${url}|${fit}|${nextFilter}`
      if (this.el === null || !document.body.contains(this.el)) {
        const el = document.createElement('div')
        // The desktop shell constrains this layer to the rounded app card
        // via the .dsh-wallpaper-layer rules; the browser keeps it full-window.
        el.className = 'dsh-wallpaper-layer'
        el.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;background-size:cover;background-position:center;background-repeat:no-repeat;'
        this.el = el
        document.body.prepend(el)
        this.lastSignature = null
      }
      if (this.lastSignature !== signature) {
        const bg = backgroundStyle(fit)
        this.el.style.backgroundImage = `url("${url}")`
        this.el.style.filter = nextFilter
        this.el.style.backgroundSize = bg.size
        this.el.style.backgroundRepeat = bg.repeat
        this.el.style.backgroundPosition = bg.position
        this.lastSignature = signature
      }
      this.shadeTokens(ctx)
    } finally {
      this.applying = false
    }
  }

  /** Remove the wallpaper layer and its token overrides (fiber unload). */
  dispose(): void {
    this.clear()
  }

  /** The current wallpaper URL (for previews and removal buttons). */
  get currentUrl(): string | null {
    return this.el === null || this.lastSignature === null ? null : readWallpaper()
  }

  /** Remove the layer and the override layer; forget the applied signature. */
  private clear(): void {
    this.el?.remove()
    this.el = null
    this.lastSignature = null
    this.disposeOverride?.()
    this.disposeOverride = null
  }

  /**
   * Stack the wallpaper's token override layer: the main canvas
   * (--dsw-alias-bg-base) and the sidebar (--dsw-specific-sidebar-fill)
   * become translucent at the configured wash. Re-calling with the same
   * source replaces the whole layer (per the ThemeRuntime contract).
   */
  private shadeTokens(ctx: ClientContext): void {
    const snapshot = ctx.theme.getTheme()
    const alpha = readOpacity()
    const sidebarAlpha = Math.min(1, alpha + 0.1)
    const base = snapshot.active.tokens['--dsw-alias-bg-base']
    const baseLight = typeof base === 'string' ? base : BUILTIN_BASE.light
    const baseDark = typeof base === 'string' ? base : BUILTIN_BASE.dark
    const overrides: ThemeTokenOverrides = {
      '--dsw-alias-bg-base': {
        light: toRgba(baseLight, alpha),
        dark: toRgba(baseDark, alpha),
      },
      '--dsw-specific-sidebar-fill': {
        light: toRgba(baseLight, sidebarAlpha),
        dark: toRgba(baseDark, sidebarAlpha),
      },
    }
    this.disposeOverride?.()
    this.disposeOverride = ctx.theme.overrideTokens(OVERRIDE_SOURCE, overrides)
  }
}
