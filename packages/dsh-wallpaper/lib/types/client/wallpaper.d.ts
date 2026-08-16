/**
 * Wallpaper layer + token shading. One fixed backdrop element is kept in the
 * body (z-index -1) and the theme runtime gets an override layer that makes
 * the main canvas and the sidebar translucent at the configured wash, so the
 * image shows through while inner surfaces stay opaque and readable.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Parse a hex or rgb()/rgba() color into rgba() with the given alpha. */
export declare function toRgba(color: string, alpha: number): string;
/**
 * Owns the wallpaper DOM element and the theme override layer for one plugin
 * instance. All reads go through the persistence module; callers re-apply
 * after any change (sliders are rAF-coalesced by the caller).
 */
export declare class WallpaperController {
    private el;
    private disposeOverride;
    private lastSignature;
    private applying;
    /**
     * Render (or clear) the wallpaper layer and its token shading from the
     * current persisted settings.
     * @param ctx - client context (theme service access).
     */
    apply(ctx: ClientContext): void;
    /** Remove the wallpaper layer and its token overrides (fiber unload). */
    dispose(): void;
    /** The current wallpaper URL (for previews and removal buttons). */
    get currentUrl(): string | null;
    /** Remove the layer and the override layer; forget the applied signature. */
    private clear;
    /**
     * Stack the wallpaper's token override layer: the main canvas
     * (--dsw-alias-bg-base) and the sidebar (--dsw-specific-sidebar-fill)
     * become translucent at the configured wash. Re-calling with the same
     * source replaces the whole layer (per the ThemeRuntime contract).
     */
    private shadeTokens;
}
