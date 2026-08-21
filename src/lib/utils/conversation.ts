import type { Conversation, Participant, User } from '@/types/models';
import { toTimestamp } from './formatDate';

function isPopulated(participant: Participant): participant is User {
  return typeof participant === 'object' && participant !== null && '_id' in participant;
}

/**
 * `participants` comes back as bare id strings on some responses and as
 * populated user objects on others, so both shapes are normalized here rather
 * than at every call site.
 */
export function getParticipants(conversation: Conversation): User[] {
  const raw = conversation.participants;
  return Array.isArray(raw) ? raw.filter(isPopulated) : [];
}

export function getParticipantIds(conversation: Conversation): string[] {
  const raw = conversation.participants;
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => (isPopulated(p) ? p._id : p)).filter(Boolean);
}

export function getParticipantCount(conversation: Conversation): number {
  return getParticipantIds(conversation).length;
}

export function isGroup(conversation: Conversation): boolean {
  return conversation.type === 'group';
}

/** Group name, or the other person's name for a direct conversation. */
export function getConversationName(
  conversation: Conversation,
  currentUserId?: string
): string {
  if (isGroup(conversation)) {
    return conversation.name?.trim() || 'Unnamed group';
  }
  const other = getParticipants(conversation).find((p) => p._id !== currentUserId);
  return other?.name ?? conversation.name?.trim() ?? 'Direct message';
}

/** Timestamp used for list ordering and the preview column. */
export function getLastActivity(conversation: Conversation): string | undefined {
  return (
    conversation.lastMessage?.createdAt ??
    conversation.updatedAt ??
    conversation.createdAt
  );
}

export function sortByRecency(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort(
    (a, b) => toTimestamp(getLastActivity(b)) - toTimestamp(getLastActivity(a))
  );
}

export function isAdmin(conversation: Conversation, userId?: string): boolean {
  if (!userId || !Array.isArray(conversation.admins)) return false;
  return conversation.admins.some((admin) =>
    typeof admin === 'string' ? admin === userId : admin?._id === userId
  );
}
