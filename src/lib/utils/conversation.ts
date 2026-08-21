import type { Conversation, ConversationType, Participant, User } from '@/types/models';
import { toTimestamp } from './formatDate';
import { getEntityId } from './ids';

const PLACEHOLDER_NAMES = new Set(['direct message', 'direct', 'dm']);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function isPlaceholderName(name?: string | null): boolean {
  if (!name) return true;
  return PLACEHOLDER_NAMES.has(name.trim().toLowerCase());
}

function participantFromUnknown(value: unknown): Participant | null {
  if (typeof value === 'string') {
    const id = value.trim();
    return id || null;
  }

  const obj = asRecord(value);
  if (!obj) return null;

  const nested = asRecord(obj.user) ?? obj;
  const _id = getEntityId(nested) ?? getEntityId(obj);
  if (!_id) return null;

  const name =
    typeof nested.name === 'string'
      ? nested.name.trim()
      : typeof obj.name === 'string'
        ? obj.name.trim()
        : '';
  const phone =
    typeof nested.phone === 'string'
      ? nested.phone
      : typeof obj.phone === 'string'
        ? obj.phone
        : '';

  if (name && !isPlaceholderName(name)) {
    return { _id, name, phone };
  }
  return _id;
}

function collectRawParticipants(raw: Record<string, unknown>): unknown[] {
  const buckets = [
    raw.participants,
    raw.members,
    raw.users,
    raw.userIds,
    raw.participantIds,
  ];
  const collected: unknown[] = [];
  for (const bucket of buckets) {
    if (Array.isArray(bucket)) collected.push(...bucket);
  }
  for (const key of ['otherUser', 'recipient', 'peer', 'withUser']) {
    if (raw[key]) collected.push(raw[key]);
  }
  return collected;
}

function collectAdmins(raw: Record<string, unknown>): unknown[] {
  const buckets = [raw.admins, raw.adminIds, raw.admin];
  const collected: unknown[] = [];
  for (const bucket of buckets) {
    if (Array.isArray(bucket)) collected.push(...bucket);
    else if (bucket) collected.push(bucket);
  }
  return collected;
}

export function normalizeConversation(raw: unknown): Conversation | null {
  const obj = asRecord(raw);
  if (!obj) return null;

  const nested =
    asRecord(obj.conversation) ??
    (asRecord(obj.data) && !obj.type && !obj.participants ? asRecord(obj.data) : null) ??
    obj;

  const _id = getEntityId(nested);
  if (!_id) return null;

  const type: ConversationType =
    nested.type === 'group' || nested.isGroup === true ? 'group' : 'direct';

  const name = typeof nested.name === 'string' ? nested.name : undefined;
  const participants = collectRawParticipants(nested)
    .map(participantFromUnknown)
    .filter((p): p is Participant => p !== null);

  const lastMessageRaw = asRecord(nested.lastMessage);
  const lastSender = lastMessageRaw
    ? participantFromUnknown(lastMessageRaw.sender)
    : null;
  const lastMessage = lastMessageRaw
    ? {
        _id: getEntityId(lastMessageRaw),
        text: typeof lastMessageRaw.text === 'string' ? lastMessageRaw.text : '',
        sender: lastSender ?? undefined,
        createdAt:
          typeof lastMessageRaw.createdAt === 'string'
            ? lastMessageRaw.createdAt
            : undefined,
      }
    : undefined;

  return {
    _id,
    type,
    name,
    participants,
    admins: collectAdmins(nested)
      .map(participantFromUnknown)
      .filter((p): p is Participant => p !== null),
    lastMessage: lastMessage?.text || lastMessage?.createdAt ? lastMessage : undefined,
    updatedAt: typeof nested.updatedAt === 'string' ? nested.updatedAt : undefined,
    createdAt: typeof nested.createdAt === 'string' ? nested.createdAt : undefined,
  };
}

function isPopulated(participant: Participant): participant is User {
  return (
    typeof participant === 'object' &&
    participant !== null &&
    Boolean(getEntityId(participant)) &&
    typeof participant.name === 'string' &&
    !isPlaceholderName(participant.name)
  );
}

export function getParticipants(conversation: Conversation): User[] {
  const raw = conversation.participants;
  if (!Array.isArray(raw)) return [];
  return raw.filter(isPopulated).map((p) => ({
    ...p,
    _id: getEntityId(p) ?? p._id,
  }));
}

export function getParticipantIds(conversation: Conversation): string[] {
  const raw = conversation.participants;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((p) => (typeof p === 'string' ? p.trim() : getEntityId(p)))
    .filter((id): id is string => Boolean(id));
}

export function getParticipantCount(conversation: Conversation): number {
  return getParticipantIds(conversation).length;
}

export function resolveMembers(
  conversation: Conversation,
  knownUsers: Record<string, Pick<User, '_id' | 'name'> & { phone?: string }>
): User[] {
  return getParticipantIds(conversation).map((id) => {
    const populated = getParticipants(conversation).find((p) => p._id === id);
    if (populated) return populated;
    const known = knownUsers[id];
    if (known) {
      return { _id: known._id, name: known.name, phone: known.phone ?? '' };
    }
    return { _id: id, name: 'Member', phone: '' };
  });
}

export function isGroup(conversation: Conversation): boolean {
  return conversation.type === 'group';
}

export function getOtherParticipantId(
  conversation: Conversation,
  currentUserId?: string
): string | undefined {
  return getParticipantIds(conversation).find((id) => id !== currentUserId);
}

export function hydrateConversation(
  conversation: Conversation,
  currentUserId: string | undefined,
  knownUsers: Record<string, Pick<User, '_id' | 'name'> & { phone?: string }>,
  peer?: Pick<User, '_id' | 'name'> & { phone?: string }
): Conversation {
  const ids = getParticipantIds(conversation);
  const participants: Participant[] = ids.map((id) => {
    if (peer && id === peer._id) {
      return { _id: peer._id, name: peer.name, phone: peer.phone ?? '' };
    }
    const known = knownUsers[id];
    if (known) {
      return { _id: known._id, name: known.name, phone: known.phone ?? '' };
    }
    const existing = getParticipants(conversation).find((p) => p._id === id);
    return existing ?? id;
  });

  if (peer && !ids.includes(peer._id)) {
    participants.push({
      _id: peer._id,
      name: peer.name,
      phone: peer.phone ?? '',
    });
  }

  return { ...conversation, participants };
}

/** Group name, or the other person's name for a direct conversation. */
export function getConversationName(
  conversation: Conversation,
  currentUserId?: string,
  knownUsers?: Record<string, Pick<User, '_id' | 'name'>>,
  peer?: Pick<User, '_id' | 'name'>
): string {
  if (isGroup(conversation)) {
    const groupName = conversation.name?.trim();
    return groupName && !isPlaceholderName(groupName) ? groupName : 'Unnamed group';
  }

  if (peer?.name && !isPlaceholderName(peer.name)) return peer.name;

  const populated = getParticipants(conversation).find(
    (p) => p._id !== currentUserId
  );
  if (populated?.name && !isPlaceholderName(populated.name)) {
    return populated.name.trim();
  }

  const otherId = getOtherParticipantId(conversation, currentUserId);
  const remembered = otherId ? knownUsers?.[otherId]?.name.trim() : undefined;
  if (remembered && !isPlaceholderName(remembered)) return remembered;

  const sender = conversation.lastMessage?.sender;
  const senderId = getEntityId(sender);
  const senderName =
    sender && typeof sender === 'object' && typeof sender.name === 'string'
      ? sender.name.trim()
      : '';
  if (senderName && !isPlaceholderName(senderName) && senderId !== currentUserId) {
    return senderName;
  }

  const fallback = conversation.name?.trim();
  if (fallback && !isPlaceholderName(fallback)) return fallback;

  return 'Direct message';
}

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

export function getAdminIds(conversation: Conversation): string[] {
  const raw = conversation.admins;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((admin) => (typeof admin === 'string' ? admin.trim() : getEntityId(admin)))
    .filter((id): id is string => Boolean(id));
}

export function isAdmin(conversation: Conversation, userId?: string): boolean {
  if (!userId) return false;
  const ids = getAdminIds(conversation);
  if (ids.length === 0) {
    // List payloads often omit `admins`. The API still enforces permission.
    return true;
  }
  return ids.includes(userId);
}
