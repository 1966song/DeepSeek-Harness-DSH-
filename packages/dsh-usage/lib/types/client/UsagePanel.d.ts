import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Full props delivered by the sidebar footer action slot. */
export type UsagePanelProps = PropsRuntime<'sidebar.footer.action'> & PropsLocale<typeof NS>;
/**
 * Render the usage entry and, when opened, the dashboard drawer.
 * @param props - the footer action props (wide flag + locale seat).
 * @returns the entry button and the portal-mounted drawer.
 */
export declare function UsagePanel({ wide, t }: UsagePanelProps): import("react").JSX.Element;
