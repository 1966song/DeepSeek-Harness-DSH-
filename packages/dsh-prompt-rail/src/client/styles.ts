/**
 * One injected stylesheet: web client plugins are served as a single bundle.
 * Class names use the plugin prefix to avoid collisions in the assembled app.
 */

/** Stable style id; idempotent across HMR re-runs. */
export const STYLE_ID = 'dsh-prompt-rail-style'

/**
 * Visual treatment for the compact, enlarged-hit-area message rail. User
 * marks are light 8×3px lines; assistant marks are shorter and dimmer. Hover
 * or focus grows the current mark to a 28px dark bar, tapers neighbors, and
 * reveals a preview bubble with the message text.
 */
export const cssText = `
.dsh_messageJumpRail_nav {
  position: sticky;
  z-index: 9;
  top: 50%;
  left: 8px;
  width: 56px;
  height: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  pointer-events: none;
}
.dsh_messageJumpRail_items {
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: translateY(-50%);
  pointer-events: none;
}
.dsh_messageJumpRail_item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 56px;
  height: 10px;
  flex: 0 0 10px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
}
.dsh_messageJumpRail_mark {
  display: block;
  width: 8px;
  height: 3px;
  border-radius: 2px;
  background: var(--dsw-alias-label-tertiary);
  opacity: 0.55;
  transition: width 120ms ease, opacity 120ms ease;
}
.dsh_messageJumpRail_item[data-kind='assistant'] .dsh_messageJumpRail_mark {
  width: 4px;
  height: 2px;
  opacity: 0.35;
}
.dsh_messageJumpRail_item[data-distance='0'] .dsh_messageJumpRail_mark {
  width: 28px;
  background: var(--dsw-alias-label-primary);
  opacity: 0.9;
}
.dsh_messageJumpRail_item[data-kind='assistant'][data-distance='0'] .dsh_messageJumpRail_mark {
  width: 20px;
  opacity: 0.8;
}
.dsh_messageJumpRail_item[data-distance='1'] .dsh_messageJumpRail_mark {
  width: 20px;
}
.dsh_messageJumpRail_item[data-kind='assistant'][data-distance='1'] .dsh_messageJumpRail_mark {
  width: 12px;
}
.dsh_messageJumpRail_item[data-distance='2'] .dsh_messageJumpRail_mark {
  width: 14px;
}
.dsh_messageJumpRail_item[data-distance='3'] .dsh_messageJumpRail_mark {
  width: 10px;
}
.dsh_messageJumpRail_item[data-selected] .dsh_messageJumpRail_mark {
  background: var(--dsw-alias-brand-primary);
  opacity: 1;
}
.dsh_messageJumpRail_preview {
  display: none;
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  max-width: 340px;
  min-width: 160px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  white-space: pre-wrap;
  word-break: break-word;
  pointer-events: none;
}
.dsh_messageJumpRail_item[data-preview-active] .dsh_messageJumpRail_preview {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dsh_messageJumpRail_previewKind {
  display: block;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 16px;
  margin-bottom: 2px;
}
`

/** Inject (or refresh) the stylesheet once; idempotent. */
export function adoptStyles(): void {
  const existing = document.getElementById(STYLE_ID)
  if (existing !== null) {
    existing.textContent = cssText
    return
  }
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = cssText
  document.head.appendChild(style)
}
