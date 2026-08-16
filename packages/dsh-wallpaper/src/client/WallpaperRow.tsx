/**
 * Wallpaper settings row, registered into Settings → General. Choose a local
 * image (compressed to a data URL), paste an image URL, tune the wash opacity
 * and blur, pick a fit mode, and remove the wallpaper.
 */
import { useRef, useState } from 'react'
import type { PropsLocale, PropsRuntime, SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import { readImageAsDataUrl } from './image.ts'
import { NS } from './locales.ts'
import { dataUrlTooLarge, FITS, MAX_DATA_URL, sanitizeWallpaperUrl, type Fit } from './persistence.ts'
import type { WallpaperRowState } from './store.ts'

/** Business face the apply-world injects into the row. */
export interface WallpaperInjected {
  /** Set (or clear with null) the wallpaper image URL. */
  setWallpaper(url: string | null): void
  /** Set the wash opacity in percent (0..100). */
  setOpacity(percent: number): void
  /** Set the blur radius in px (0..60). */
  setBlur(px: number): void
  /** Set the display mode. */
  setFit(fit: Fit): void
  /** Surface an error code (locale key suffix) without touching settings. */
  setError(code: string | null): void
}

/** Full props delivered by the settings.general.item slot. */
export type WallpaperRowProps = PropsRuntime<'settings.general.item'>
  & PropsLocale<typeof NS>
  & WallpaperInjected
  & { useStore: SnapshotSelectorHook<WallpaperRowState> }

/** Inline style sheet for the row (kept dependency-free). */
const styles: Record<string, React.CSSProperties> = {
  group: {
    borderBottom: '1px solid var(--dsw-alias-border-l2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px 0',
  },
  title: {
    color: 'var(--dsw-alias-label-primary)',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '22px',
  },
  hint: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '12px',
    lineHeight: '18px',
  },
  error: {
    color: 'var(--dsw-alias-state-error-primary)',
    fontSize: '12px',
    lineHeight: '18px',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  preview: {
    width: '56px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid var(--dsw-alias-border-l1)',
    flex: '0 0 auto',
  },
  button: {
    color: 'var(--dsw-alias-label-primary)',
    background: 'var(--dsw-alias-bg-layer-2)',
    border: '1px solid var(--dsw-alias-border-l1)',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '16px',
    padding: '4px 10px',
    cursor: 'pointer',
  },
  buttonDanger: {
    color: 'var(--dsw-alias-state-error-primary)',
  },
  urlRow: {
    display: 'flex',
    gap: '8px',
  },
  urlInput: {
    flex: 1,
    minWidth: 0,
    color: 'var(--dsw-alias-label-primary)',
    background: 'var(--dsw-alias-bg-layer-2)',
    border: '1px solid var(--dsw-alias-border-l1)',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '16px',
    padding: '4px 8px',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sliderLabel: {
    color: 'var(--dsw-alias-label-secondary)',
    fontSize: '12px',
    lineHeight: '18px',
    flex: '0 0 84px',
  },
  slider: {
    flex: 1,
    minWidth: 0,
    accentColor: 'var(--dsw-alias-brand-primary)',
  },
  sliderValue: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '12px',
    lineHeight: '18px',
    flex: '0 0 44px',
    textAlign: 'right',
  },
  fitRow: {
    display: 'flex',
    gap: '6px',
    flex: 1,
  },
  fitButton: {
    color: 'var(--dsw-alias-label-secondary)',
    background: 'transparent',
    border: '1px solid var(--dsw-alias-border-l1)',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '16px',
    padding: '3px 8px',
    cursor: 'pointer',
  },
  fitButtonSelected: {
    color: 'var(--dsw-alias-label-primary)',
    borderColor: 'var(--dsw-alias-brand-primary)',
  },
}

/** Error locale keys accepted by the typed `t` seat. */
type ErrorKey =
  | 'wallpaper.errorTooLarge'
  | 'wallpaper.errorRead'
  | 'wallpaper.errorSave'
  | 'wallpaper.errorBlob'
  | 'wallpaper.errorDead'
  | 'wallpaper.urlInvalid'

/** Map an error code onto its locale key. */
function errorKey(code: string): ErrorKey {
  if (code === 'tooLarge') return 'wallpaper.errorTooLarge'
  if (code === 'read') return 'wallpaper.errorRead'
  if (code === 'save') return 'wallpaper.errorSave'
  if (code === 'blob') return 'wallpaper.errorBlob'
  if (code === 'dead') return 'wallpaper.errorDead'
  return 'wallpaper.urlInvalid'
}

/** One labeled slider (opacity or blur). */
function Slider({ label, value, min, max, step, format, onChange }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (value: number) => string
  onChange: (value: number) => void
}) {
  return (
    <div style={styles.sliderRow}>
      <span style={styles.sliderLabel}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={styles.slider}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span style={styles.sliderValue}>{format(value)}</span>
    </div>
  )
}

/**
 * Render the wallpaper row.
 * @param props - the settings row props.
 * @returns the row markup.
 */
export function WallpaperRow({ t, setWallpaper, setOpacity, setBlur, setFit, setError, useStore }: WallpaperRowProps) {
  const url = useStore((state) => state.url)
  const opacity = useStore((state) => state.opacity)
  const blur = useStore((state) => state.blur)
  const fit = useStore((state) => state.fit)
  const error = useStore((state) => state.error)
  const inputRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState('')

  const onPick = () => inputRef.current?.click()
  const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file === undefined) return
    event.target.value = ''
    readImageAsDataUrl(file, (dataUrl) => {
      if (dataUrl === null) setError('read')
      else setWallpaper(dataUrl)
    }, MAX_DATA_URL)
  }
  const applyUrl = () => {
    const trimmed = urlInput.trim()
    if (/^blob:/i.test(trimmed)) {
      setError('blob')
      return
    }
    const sanitized = sanitizeWallpaperUrl(trimmed)
    if (sanitized === null) {
      setError('invalid')
      return
    }
    if (dataUrlTooLarge(sanitized)) {
      setError('tooLarge')
      return
    }
    setWallpaper(sanitized)
    setUrlInput('')
  }

  return (
    <div style={styles.group}>
      <div style={styles.title}>{t('wallpaper.title')}</div>
      <div style={styles.actionRow}>
        {url !== null ? <img src={url} alt="" referrerPolicy="no-referrer" style={styles.preview} /> : null}
        <button type="button" style={styles.button} onClick={onPick}>{t('wallpaper.choose')}</button>
        {url !== null
          ? <button type="button" style={{ ...styles.button, ...styles.buttonDanger }} onClick={() => setWallpaper(null)}>{t('wallpaper.remove')}</button>
          : null}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
      </div>
      <div style={styles.urlRow}>
        <input
          type="text"
          value={urlInput}
          placeholder={t('wallpaper.urlPlaceholder')}
          style={styles.urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') applyUrl() }}
        />
        <button type="button" style={styles.button} onClick={applyUrl}>{t('wallpaper.urlApply')}</button>
      </div>
      <div style={styles.sliderRow}>
        <span style={styles.sliderLabel}>{t('wallpaper.fit')}</span>
        <div style={styles.fitRow}>
          {FITS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={fit === value}
              onClick={() => setFit(value)}
              style={{ ...styles.fitButton, ...(fit === value ? styles.fitButtonSelected : {}) }}
            >
              {t(`wallpaper.fit.${value}`)}
            </button>
          ))}
        </div>
      </div>
      <Slider
        label={t('wallpaper.opacity')}
        value={Math.round(opacity * 100)}
        min={0}
        max={100}
        step={1}
        format={(value) => `${value}%`}
        onChange={setOpacity}
      />
      <Slider
        label={t('wallpaper.blur')}
        value={blur}
        min={0}
        max={60}
        step={1}
        format={(value) => `${value}px`}
        onChange={setBlur}
      />
      {error !== null ? <div style={styles.error}>{t(errorKey(error))}</div> : null}
      <div style={styles.hint}>{t('wallpaper.hint')}</div>
    </div>
  )
}
