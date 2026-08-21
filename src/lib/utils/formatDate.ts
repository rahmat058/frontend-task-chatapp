import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

/**
 * Format a message timestamp for display in the chat bubble.
 * e.g. "3:42 PM"
 */
export function formatMessageTime(iso: string): string {
  return format(new Date(iso), 'h:mm a');
}

/**
 * Format a conversation list timestamp.
 * Shows time for today, "Yesterday" for yesterday, and date otherwise.
 */
export function formatConversationTime(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

/**
 * Relative time — "2 minutes ago", "an hour ago", etc.
 */
export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}
