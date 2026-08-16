/**
 * Image intake: downscale and JPEG-compress a picked file into a data URL that
 * fits comfortably inside the localStorage quota.
 */
/**
 * Read a picked image file into a compressed data URL.
 * @param file - the picked file (image/*).
 * @param onDone - receives the data URL, or null on any failure.
 * @param maxBytes - the caller's persisted-size cap.
 */
export declare function readImageAsDataUrl(file: File, onDone: (dataUrl: string | null) => void, maxBytes: number): void;
