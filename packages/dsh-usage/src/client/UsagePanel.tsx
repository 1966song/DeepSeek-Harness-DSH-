/**
 * Usage widget: one entry in the sidebar footer action row (rail icon / wide
 * label) that opens a right-side dashboard drawer with totals, a 30-day bar
 * chart, the per-session table, and the account balance. Data comes from the
 * host route /api/dsh-usage/overview.
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { UsageOverview } from '../shared.ts'
import { NS } from './locales.ts'

/** Full props delivered by the sidebar footer action slot. */
export type UsagePanelProps = PropsRuntime<'sidebar.footer.action'> & PropsLocale<typeof NS>

/** Inline style sheet for the widget and drawer (kept dependency-free). */
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
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  card: {
    background: 'var(--dsw-alias-bg-layer-2)',
    border: '1px solid var(--dsw-alias-border-l1)',
    borderRadius: '8px',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardLabel: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '11px',
    lineHeight: '16px',
  },
  cardValue: {
    color: 'var(--dsw-alias-label-primary)',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '22px',
  },
  cardHint: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '11px',
    lineHeight: '16px',
  },
  sectionTitle: {
    color: 'var(--dsw-alias-label-primary)',
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '18px',
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '3px',
    height: '88px',
    padding: '8px',
    background: 'var(--dsw-alias-bg-layer-2)',
    border: '1px solid var(--dsw-alias-border-l1)',
    borderRadius: '8px',
  },
  bar: {
    flex: 1,
    minWidth: '2px',
    borderRadius: '2px 2px 0 0',
    background: 'var(--dsw-alias-brand-primary)',
    opacity: 0.85,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
    lineHeight: '18px',
  },
  th: {
    color: 'var(--dsw-alias-label-tertiary)',
    fontWeight: 400,
    textAlign: 'left',
    padding: '4px 6px',
    borderBottom: '1px solid var(--dsw-alias-border-l1)',
    whiteSpace: 'nowrap',
  },
  td: {
    color: 'var(--dsw-alias-label-secondary)',
    padding: '4px 6px',
    borderBottom: '1px solid var(--dsw-alias-border-l1)',
    whiteSpace: 'nowrap',
  },
  tdTitle: {
    maxWidth: '140px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
  status: {
    color: 'var(--dsw-alias-state-warn-primary)',
    fontSize: '12px',
    lineHeight: '18px',
  },
}

/** Compact token formatting (1.2K / 34.5M). */
function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`
  return String(Math.round(value))
}

/** Money formatting (¥0.00 / ¥1.23). */
function formatMoney(value: number): string {
  return `¥${value.toFixed(2)}`
}

/** Short local date (MM-DD). */
function formatDay(day: string): string {
  return day.slice(5)
}

/** Short updated-at (MM-DD HH:mm). */
function formatUpdated(time: number): string {
  const date = new Date(time)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${mm}-${dd} ${hh}:${mi}`
}

/** Fetch the overview from the host route. */
async function fetchOverview(): Promise<UsageOverview> {
  const response = await fetch('/api/dsh-usage/overview', { cache: 'no-store' })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return await response.json() as UsageOverview
}

/** One labeled stat card. */
function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div style={styles.card}>
      <span style={styles.cardLabel}>{label}</span>
      <span style={styles.cardValue}>{value}</span>
      {hint !== undefined ? <span style={styles.cardHint}>{hint}</span> : null}
    </div>
  )
}

/**
 * Render the usage entry and, when opened, the dashboard drawer.
 * @param props - the footer action props (wide flag + locale seat).
 * @returns the entry button and the portal-mounted drawer.
 */
export function UsagePanel({ wide, t }: UsagePanelProps) {
  const [open, setOpen] = useState(false)
  const [overview, setOverview] = useState<UsageOverview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setOverview(await fetchOverview())
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
    // Keep the last payload: reopening renders it instantly and refreshes
    // in the background instead of blank-waiting on the fetch.
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closePanel() }
    document.addEventListener('keydown', onKey)
    timerRef.current = window.setInterval(() => { void load() }, 60_000)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const totalTokens = overview === null
    ? 0
    : overview.totals.uncachedInput + overview.totals.cacheRead + overview.totals.cacheWrite + overview.totals.output
  const cacheRate = overview === null || totalTokens - overview.totals.output === 0
    ? null
    : (overview.totals.cacheRead / (overview.totals.uncachedInput + overview.totals.cacheRead + overview.totals.cacheWrite)) * 100
  const maxDay = overview === null || overview.perDay.length === 0
    ? 1
    : Math.max(1, ...overview.perDay.map((day) => day.uncachedInput + day.cacheRead + day.cacheWrite + day.output))

  const action = (
    <button
      type="button"
      style={{ ...styles.action, ...(open ? styles.actionActive : {}) }}
      aria-label={t('usage.actionAria')}
      aria-pressed={open}
      onClick={openPanel}
    >
      <span style={styles.actionIcon} aria-hidden>⚡</span>
      {wide ? <span>{t('usage.actionLabel')}</span> : null}
    </button>
  )

  if (!open) return action

  return (
    <>
      {action}
      {createPortal(
        <>
          <div style={styles.backdrop} onClick={closePanel} />
          <aside style={styles.drawer} role="dialog" aria-label={t('usage.panelTitle')}>
            <div style={styles.header}>
              <span style={styles.headerTitle}>{t('usage.panelTitle')}</span>
              <button type="button" style={styles.button} onClick={() => { void load() }}>{t('usage.refresh')}</button>
              <button type="button" style={styles.button} onClick={closePanel}>{t('usage.close')}</button>
            </div>
            <div style={styles.body}>
              {error !== null ? <div style={styles.status}>{t('usage.error', { message: error })}</div> : null}
              {loading && overview === null ? <div style={styles.empty}>{t('usage.loading')}</div> : null}
              {overview === null && !loading && error === null ? <div style={styles.empty}>{t('usage.empty')}</div> : null}
              {overview !== null ? (
                <>
                  <div style={styles.cards}>
                    {overview.balance === null
                      ? <Card label={t('usage.balance')} value={t('usage.balanceUnavailable')} />
                      : overview.balance.error !== undefined
                        ? <Card label={t('usage.balance')} value={t('usage.balanceError')} hint={overview.balance.error} />
                        : <Card label={t('usage.balance')} value={`${overview.balance.currency} ${overview.balance.total.toFixed(2)}`} hint={overview.balance.available ? undefined : t('usage.balanceError')} />}
                    <Card label={t('usage.totalTokens')} value={formatTokens(totalTokens)} hint={`${overview.totals.sessions} ${t('usage.sessions')}`} />
                    <Card label={t('usage.estimatedCost')} value={formatMoney(overview.totals.cost)} hint={overview.pricing.currency} />
                    <Card label={t('usage.cacheHitRate')} value={cacheRate === null ? '—' : `${cacheRate.toFixed(1)}%`} />
                  </div>
                  <div>
                    <div style={styles.sectionTitle}>{t('usage.lastDays')}</div>
                    <div style={styles.chart} role="img" aria-label={t('usage.lastDays')}>
                      {overview.perDay.map((day) => {
                        const value = day.uncachedInput + day.cacheRead + day.cacheWrite + day.output
                        return (
                          <div
                            key={day.day}
                            style={{ ...styles.bar, height: `${Math.max(2, Math.round((value / maxDay) * 100))}%` }}
                            title={`${day.day}: ${formatTokens(value)}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={styles.sectionTitle}>{t('usage.sessionTable')}</div>
                    {overview.perSession.length === 0
                      ? <div style={styles.empty}>{t('usage.empty')}</div>
                      : (
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={styles.th}>{t('usage.sessionTable')}</th>
                              <th style={styles.th}>{t('usage.session.updated')}</th>
                              <th style={styles.th}>{t('usage.session.input')}</th>
                              <th style={styles.th}>{t('usage.session.cache')}</th>
                              <th style={styles.th}>{t('usage.session.output')}</th>
                              <th style={styles.th}>{t('usage.session.cost')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {overview.perSession.map((session) => (
                              <tr key={session.id}>
                                <td style={{ ...styles.td, ...styles.tdTitle }} title={session.id}>{session.title}</td>
                                <td style={styles.td}>{formatUpdated(session.updatedAt)}</td>
                                <td style={styles.td}>{formatTokens(session.uncachedInput)}</td>
                                <td style={styles.td}>{formatTokens(session.cacheRead)}</td>
                                <td style={styles.td}>{formatTokens(session.output)}</td>
                                <td style={styles.td}>{formatMoney(session.cost)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                  </div>
                  <div style={styles.note}>
                    {t('usage.note.pricing', {
                      input: overview.pricing.inputPerM,
                      cacheRead: overview.pricing.cacheReadPerM,
                      cacheWrite: overview.pricing.cacheWritePerM,
                      output: overview.pricing.outputPerM,
                    })}
                  </div>
                  <div style={styles.note}>{t('usage.note.balance')}</div>
                  <div style={styles.note}>{t('usage.note.source')}</div>
                </>
              ) : null}
            </div>
          </aside>
        </>,
        document.body,
      )}
    </>
  )
}
