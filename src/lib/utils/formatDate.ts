import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns'

/**
 * The API omits `createdAt` on some conversations and returns it unpopulated
 * on others, so every timestamp is treated as untrusted before formatting.
 */
export function parseDate(iso?: string | null): Date | null {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Sortable epoch value; unparseable timestamps sort oldest. */
export function toTimestamp(iso?: string | null): number {
  return parseDate(iso)?.getTime() ?? 0
}

/** Message bubble timestamp — "3:42 PM". */
export function formatMessageTime(iso?: string | null): string {
  const date = parseDate(iso)
  return date ? format(date, 'h:mm a') : ''
}

/** Conversation list timestamp — time today, "Yesterday", then a date. */
export function formatConversationTime(iso?: string | null): string {
  const date = parseDate(iso)
  if (!date) return ''
  if (isToday(date)) return format(date, 'h:mm a')
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d')
}

/** Date divider in a thread — "Today", "Yesterday", then a full date. */
export function formatDayLabel(iso?: string | null): string {
  const date = parseDate(iso)
  if (!date) return ''
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMMM d, yyyy')
}

export function isSameCalendarDay(a?: string | null, b?: string | null): boolean {
  const first = parseDate(a)
  const second = parseDate(b)
  if (!first || !second) return false
  return first.toDateString() === second.toDateString()
}

/** Relative time — "2 minutes ago". */
export function formatRelative(iso?: string | null): string {
  const date = parseDate(iso)
  return date ? formatDistanceToNow(date, { addSuffix: true }) : ''
}
