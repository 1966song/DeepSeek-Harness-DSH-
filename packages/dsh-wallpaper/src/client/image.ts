/**
 * Image intake: downscale and JPEG-compress a picked file into a data URL that
 * fits comfortably inside the localStorage quota.
 */

/**
 * Downscale an image onto a canvas and return a JPEG data URL.
 * @param image - the decoded source image.
 * @param maxSide - the longer side cap in px.
 * @param quality - JPEG quality (0..1).
 * @returns the compressed data URL.
 */
function compressImage(image: HTMLImageElement, maxSide: number, quality: number): string {
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))
  const context = canvas.getContext('2d')
  if (context === null) throw new Error('canvas 2d context unavailable')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * Read a picked image file into a compressed data URL.
 * @param file - the picked file (image/*).
 * @param onDone - receives the data URL, or null on any failure.
 * @param maxBytes - the caller's persisted-size cap.
 */
export function readImageAsDataUrl(file: File, onDone: (dataUrl: string | null) => void, maxBytes: number): void {
  const reader = new FileReader()
  reader.onerror = () => onDone(null)
  reader.onload = () => {
    const image = new Image()
    image.onerror = () => onDone(null)
    image.onload = () => {
      try {
        let dataUrl = compressImage(image, 1600, 0.75)
        if (dataUrl.length > maxBytes) dataUrl = compressImage(image, 1000, 0.6)
        if (dataUrl.length > maxBytes) dataUrl = compressImage(image, 800, 0.5)
        if (dataUrl.length > maxBytes) onDone(null)
        else onDone(dataUrl)
      } catch {
        onDone(null)
      }
    }
    image.src = String(reader.result)
  }
  reader.readAsDataURL(file)
}
