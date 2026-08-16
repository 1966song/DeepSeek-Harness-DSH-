import type { PropsLocale, PropsRuntime, SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
import { type Fit } from './persistence.ts';
import type { WallpaperRowState } from './store.ts';
/** Business face the apply-world injects into the row. */
export interface WallpaperInjected {
    /** Set (or clear with null) the wallpaper image URL. */
    setWallpaper(url: string | null): void;
    /** Set the wash opacity in percent (0..100). */
    setOpacity(percent: number): void;
    /** Set the blur radius in px (0..60). */
    setBlur(px: number): void;
    /** Set the display mode. */
    setFit(fit: Fit): void;
    /** Surface an error code (locale key suffix) without touching settings. */
    setError(code: string | null): void;
}
/** Full props delivered by the settings.general.item slot. */
export type WallpaperRowProps = PropsRuntime<'settings.general.item'> & PropsLocale<typeof NS> & WallpaperInjected & {
    useStore: SnapshotSelectorHook<WallpaperRowState>;
};
/**
 * Render the wallpaper row.
 * @param props - the settings row props.
 * @returns the row markup.
 */
export declare function WallpaperRow({ t, setWallpaper, setOpacity, setBlur, setFit, setError, useStore }: WallpaperRowProps): import("react").JSX.Element;
