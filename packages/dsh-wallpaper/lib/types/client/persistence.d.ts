/**
 * Wallpaper persistence. Visual preferences live in localStorage: DSH's Host
 * settings wire only exposes an allowlisted set of namespaces to browser
 * clients, so a third-party namespace would answer `settings-not-exposed`;
 * localStorage matches that boundary for visual preferences while surviving
 * reloads on the same origin.
 */
/** localStorage keys owned by this plugin. */
export declare const STORAGE_KEYS: {
    readonly image: "dsh-wallpaper:image";
    readonly opacity: "dsh-wallpaper:opacity";
    readonly blur: "dsh-wallpaper:blur";
    readonly fit: "dsh-wallpaper:fit";
};
/** Default wash opacity (0..1) applied to the translucent surfaces. */
export declare const DEFAULT_OPACITY = 0.8;
/** Default wallpaper blur radius in px. */
export declare const DEFAULT_BLUR = 0;
/** Default wallpaper display mode. */
export declare const DEFAULT_FIT = "cover";
/** Accepted wallpaper display modes. */
export declare const FITS: readonly ["cover", "contain", "stretch", "tile"];
export type Fit = (typeof FITS)[number];
/** Soft cap for persisted data URLs (localStorage quota headroom). */
export declare const MAX_DATA_URL = 1800000;
/** Read a localStorage string value (null on absence or error). */
export declare function readStorage(key: string): string | null;
/** Write (or remove with null) a localStorage value. */
export declare function writeStorage(key: string, value: string | null): boolean;
/** Wallpaper image URL (null when unset). */
export declare function readWallpaper(): string | null;
/** Wash opacity (0..1) with the default applied on absence or corruption. */
export declare function readOpacity(): number;
/** Blur radius in px (0..60) with the default applied on absence or corruption. */
export declare function readBlur(): number;
/** Display mode with the default applied on absence or corruption. */
export declare function readFit(): Fit;
/**
 * Accept only image-safe URLs: http(s), data:image/*, or a relative path.
 * blob: URLs die on reload and are rejected here.
 * @param raw - the raw user input.
 * @returns the sanitized URL, or null when rejected.
 */
export declare function sanitizeWallpaperUrl(raw: string): string | null;
/** Whether a persisted value would blow the localStorage quota headroom. */
export declare function dataUrlTooLarge(value: string): boolean;
