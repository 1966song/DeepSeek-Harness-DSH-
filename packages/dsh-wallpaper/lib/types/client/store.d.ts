import { type Fit } from './persistence.ts';
/** Row state mirroring the persisted wallpaper settings. */
export interface WallpaperRowState {
    /** Current wallpaper URL (null when unset). */
    url: string | null;
    /** Wash opacity (0..1). */
    opacity: number;
    /** Blur radius in px. */
    blur: number;
    /** Display mode. */
    fit: Fit;
    /** Last error code (locale key suffix), null when clean. */
    error: string | null;
    /** Monotonic sync counter guarding against out-of-order writes. */
    revision: number;
}
/** The row's store seat (state + draft-transform actions). */
export declare const wallpaperStore: import("@deepseek-ai/dsh-client-runtime/client").EngineStoreHandle<WallpaperRowState, {
    sync(draft: WallpaperRowState, url: string | null, opacity: number, blur: number, fit: Fit, error: string | null, revision: number): void;
}>;
