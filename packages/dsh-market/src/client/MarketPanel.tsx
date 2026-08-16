/**
 * Marketplace panel: one sidebar footer entry (above Usage) opening a drawer
 * that lists installable plugins from the local repository, supports
 * one-click install/uninstall, and accepts a git URL for manual installs.
 * All mutations go through host routes.
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { MarketCatalog, MarketPlugin, MarketResult } from '../shared.ts'
import { NS } from './locales.ts'

/** Full props delivered by the sidebar footer action slot. */
export type MarketPanelProps = PropsRuntime<'sidebar.footer.action'> & PropsLocale<typeof NS>

/** Inline style sheet for the entry and drawer (kept dependency-free). */
const styles: Record<string, React.CSSProperties> = {
  action: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--dsw-alias-label-secondary)',
    background: 'transparent',
    border: '0',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '16px',
    padding: '4px 8px',
    cursor: 'pointer',
    flex: '0 0 auto',
  },
  actionActive: {
    color: 'var(--dsw-alias-label-primary)',
    background: 'var(--dsw-alias-interactive-bg-active)',
  },
  actionIcon: {
    fontSize: '14px',
    lineHeight: '16px',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.35)',
    zIndex: 9990,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: 'min(440px, 92vw)',
    zIndex: 9991,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--dsw-alias-bg-layer-1)',
    borderLeft: '1px solid var(--dsw-alias-border-l2)',
    boxShadow: '-12px 0 32px rgba(0, 0, 0, 0.25)',
    // Clear the desktop shell's frosted title bar so the header controls
    // stay reachable (no-op in a plain browser).
    paddingTop: 36,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 16px',
    borderBottom: '1px solid var(--dsw-alias-border-l1)',
  },
  headerTitle: {
    flex: 1,
    color: 'var(--dsw-alias-label-primary)',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
  },
  button: {
    color: 'var(--dsw-alias-label-secondary)',
    background: 'transparent',
    border: '1px solid var(--dsw-alias-border-l1)',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '16px',
    padding: '3px 10px',
    cursor: 'pointer',
  },
  buttonPrimary: {
    color: 'var(--dsw-alias-label-primary)',
    borderColor: 'var(--dsw-alias-brand-primary)',
  },
  buttonDanger: {
    color: 'var(--dsw-alias-state-error-primary)',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'default',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  repoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  repoLabel: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '11px',
    lineHeight: '16px',
    flex: '0 0 auto',
  },
  repoValue: {
    color: 'var(--dsw-alias-label-secondary)',
    fontSize: '12px',
    lineHeight: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    background: 'var(--dsw-alias-bg-layer-2)',
    border: '1px solid var(--dsw-alias-border-l1)',
    borderRadius: '8px',
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  rowTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  rowName: {
    color: 'var(--dsw-alias-label-primary)',
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '18px',
  },
  badge: {
    color: 'var(--dsw-alias-state-success-primary)',
    fontSize: '11px',
    lineHeight: '16px',
    border: '1px solid var(--dsw-alias-border-l1)',
    borderRadius: '4px',
    padding: '0 5px',
  },
  badgeWarn: {
    color: 'var(--dsw-alias-state-warn-primary)',
  },
  rowDesc: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '12px',
    lineHeight: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowMeta: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '11px',
    lineHeight: '16px',
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
  status: {
    color: 'var(--dsw-alias-label-secondary)',
    fontSize: '12px',
    lineHeight: '18px',
  },
  statusError: {
    color: 'var(--dsw-alias-state-error-primary)',
  },
  statusOk: {
    color: 'var(--dsw-alias-state-success-primary)',
  },
  note: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '11px',
    lineHeight: '16px',
  },
  empty: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '12px',
    lineHeight: '18px',
    padding: '8px 0',
  },
}

/** Fetch the catalog from the host route. */
async function fetchCatalog(): Promise<MarketCatalog> {
  const response = await fetch('/api/dsh-market/catalog', { cache: 'no-store' })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return await response.json() as MarketCatalog
}

/** POST one action to a host route and read the result. */
async function postAction<T>(path: string, payload: T): Promise<MarketResult> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })
  const result = await response.json() as MarketResult
  if (!response.ok && result.message === undefined) throw new Error(`HTTP ${response.status}`)
  return result
}

/**
 * Render the market entry and, when opened, the drawer.
 * @param props - the footer action props (wide flag + locale seat).
 * @returns the entry button and the portal-mounted drawer.
 */
export function MarketPanel({ wide, t }: MarketPanelProps) {
  const [open, setOpen] = useState(false)
  const [catalog, setCatalog] = useState<MarketCatalog | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [url, setUrl] = useState('')
  const timerRef = useRef<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setCatalog(await fetchCatalog())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError))
    } finally {
      setLoading(false)
    }
  }

  const openPanel = () => {
    setOpen(true)
    void load()
  }
  const closePanel = () => {
    setOpen(false)
    setFeedback(null)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closePanel() }
    document.addEventListener('keydown', onKey)
    timerRef.current = window.setInterval(() => { void load() }, 30_000)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const run = async (label: string, action: () => Promise<MarketResult>) => {
    setBusy(label)
    setFeedback(null)
    try {
      const result = await action()
      setFeedback({ kind: result.ok ? 'ok' : 'error', text: result.message ?? (result.ok ? 'OK' : '失败') })
      await load()
    } catch (actionError) {
      setFeedback({ kind: 'error', text: actionError instanceof Error ? actionError.message : String(actionError) })
    } finally {
      setBusy(null)
    }
  }

  const installFromRepo = (plugin: MarketPlugin) => {
    if (busy !== null) return
    void run(plugin.name, () => postAction('/api/dsh-market/install', { kind: 'repo', id: plugin.name }))
  }
  const installFromUrl = () => {
    if (busy !== null) return
    const trimmed = url.trim()
    if (!/^https:\/\//.test(trimmed)) {
      setFeedback({ kind: 'error', text: t('market.urlInvalid') })
      return
    }
    setUrl('')
    void run(trimmed, () => postAction('/api/dsh-market/install', { kind: 'git', url: trimmed }))
  }
  const uninstall = (plugin: MarketPlugin) => {
    if (busy !== null) return
    void run(plugin.name, () => postAction('/api/dsh-market/uninstall', { id: plugin.id }))
  }

  const action = (
    <button
      type="button"
      style={{ ...styles.action, ...(open ? styles.actionActive : {}) }}
      aria-label={t('market.actionAria')}
      aria-pressed={open}
      onClick={openPanel}
    >
      <span style={styles.actionIcon} aria-hidden>🛒</span>
      {wide ? <span>{t('market.actionLabel')}</span> : null}
    </button>
  )

  if (!open) return action

  return (
    <>
      {action}
      {createPortal(
        <>
          <div style={styles.backdrop} onClick={closePanel} />
          <aside style={styles.drawer} role="dialog" aria-label={t('market.panelTitle')}>
            <div style={styles.header}>
              <span style={styles.headerTitle}>{t('market.panelTitle')}</span>
              <button type="button" style={styles.button} onClick={() => { void load() }}>{t('market.refresh')}</button>
              <button type="button" style={styles.button} onClick={closePanel}>{t('market.close')}</button>
            </div>
            <div style={styles.body}>
              {error !== null ? <div style={{ ...styles.status, ...styles.statusError }}>{t('market.error', { message: error })}</div> : null}
              {catalog !== null ? (
                <>
                  <div style={styles.repoRow}>
                    <span style={styles.repoLabel}>{t('market.repo')}</span>
                    <span style={styles.repoValue} title={catalog.repo ?? undefined}>
                      {catalog.repo ?? t('market.repoMissing')}
                    </span>
                  </div>
                  {catalog.plugins.length === 0
                    ? <div style={styles.empty}>{t('market.empty')}</div>
                    : catalog.plugins.map((plugin) => (
                      <div key={plugin.id} style={styles.row}>
                        <div style={styles.rowMain}>
                          <div style={styles.rowTitle}>
                            <span style={styles.rowName}>{plugin.name}</span>
                            {plugin.installed ? <span style={styles.badge}>{t('market.installed')}</span> : null}
                            {!plugin.built ? <span style={{ ...styles.badge, ...styles.badgeWarn }}>{t('market.notBuilt')}</span> : null}
                          </div>
                          <div style={styles.rowDesc}>{plugin.description}</div>
                          <div style={styles.rowMeta}>v{plugin.version}</div>
                        </div>
                        {plugin.installed
                          ? <button type="button" style={{ ...styles.button, ...styles.buttonDanger, ...(busy !== null ? styles.buttonDisabled : {}) }} disabled={busy !== null} onClick={() => uninstall(plugin)}>{t('market.uninstall')}</button>
                          : <button type="button" style={{ ...styles.button, ...styles.buttonPrimary, ...(busy !== null ? styles.buttonDisabled : {}) }} disabled={busy !== null} onClick={() => installFromRepo(plugin)}>{t('market.install')}</button>}
                      </div>
                    ))}
                  <div style={styles.urlRow}>
                    <input
                      type="text"
                      value={url}
                      placeholder={t('market.urlPlaceholder')}
                      style={styles.urlInput}
                      onChange={(event) => setUrl(event.target.value)}
                      onKeyDown={(event) => { if (event.key === 'Enter') installFromUrl() }}
                    />
                    <button type="button" style={{ ...styles.button, ...styles.buttonPrimary, ...(busy !== null ? styles.buttonDisabled : {}) }} disabled={busy !== null} onClick={installFromUrl}>{t('market.urlInstall')}</button>
                  </div>
                  {busy !== null ? <div style={styles.status}>{t('market.busy')}（{busy}）</div> : null}
                  {feedback !== null ? <div style={{ ...styles.status, ...(feedback.kind === 'ok' ? styles.statusOk : styles.statusError) }}>{feedback.text}</div> : null}
                  <div style={styles.note}>{t('market.autobuildHint')}</div>
                  <div style={styles.note}>{t('market.restartHint')}</div>
                </>
              ) : null}
              {loading && catalog === null ? <div style={styles.empty}>{t('market.loading')}</div> : null}
            </div>
          </aside>
        </>,
        document.body,
      )}
    </>
  )
}
