import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ChatNavigatorOwnerProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
/** Full props delivered by the conversation navigator slot. */
export type MessageJumpRailProps = PropsRuntime<'conversation.chat.navigator'> & ChatNavigatorOwnerProps & PropsLocale<'message-jump-rail'>;
/**
 * Render the message rail. Hover/focus controls the temporary tapered state;
 * the last activated message remains selected after that temporary state ends.
 * @param props - Navigator owner currency and plugin locale seat.
 * @returns the rail, or null when the loaded window has no addressable rows.
 */
export declare function MessageJumpRail({ items, jumpTo, t }: MessageJumpRailProps): import("react").JSX.Element | null;
