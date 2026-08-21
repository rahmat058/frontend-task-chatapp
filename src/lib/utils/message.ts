import type { Message, User } from '@/types/models';
import { getEntityId, idsMatch } from './ids';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function getSenderId(message?: {
  sender?: unknown;
  senderId?: unknown;
} | null): string | undefined {
  if (!message) return undefined;
  return getEntityId(message.sender) ?? getEntityId(message.senderId);
}

export function getSenderName(message: {
  sender?: unknown;
}): string {
  if (message.sender && typeof message.sender === 'object') {
    const name = (message.sender as { name?: unknown }).name;
    if (typeof name === 'string' && name) return name;
  }
  return 'Unknown';
}

export function isOwnMessage(
  message: { sender?: unknown; senderId?: unknown },
  currentUserId?: string | null
): boolean {
  return idsMatch(getSenderId(message), currentUserId);
}

export function normalizeSender(
  raw: unknown,
  currentUser?: User | null
): Pick<User, '_id' | 'name'> {
  const id = getEntityId(raw) ?? '';
  const nameFromObject =
    raw && typeof raw === 'object' && typeof asRecord(raw)?.name === 'string'
      ? (asRecord(raw)!.name as string)
      : undefined;

  if (nameFromObject) return { _id: id, name: nameFromObject };
  if (currentUser && idsMatch(id, currentUser._id)) {
    return { _id: id || currentUser._id, name: currentUser.name };
  }
  return { _id: id, name: 'Unknown' };
}

/**
 * Coerce whatever the API or socket actually sent into the Message shape
 * the UI compares against. Bare sender ids become `{ _id }` so own messages
 * stay right-aligned after confirmation.
 */
export function normalizeMessage(
  raw: unknown,
  currentUser?: User | null
): Message | null {
  const obj = asRecord(raw);
  if (!obj) return null;

  const nested =
    asRecord(obj.message) ??
    (asRecord(obj.data) && !obj.text ? asRecord(obj.data) : null) ??
    obj;

  const _id = getEntityId(nested._id ?? nested.id);
  if (!_id) return null;

  const conversationId =
    getEntityId(nested.conversationId) ?? getEntityId(nested.conversation) ?? '';

  const text = typeof nested.text === 'string' ? nested.text : '';
  const createdAt =
    typeof nested.createdAt === 'string'
      ? nested.createdAt
      : new Date().toISOString();
  const updatedAt =
    typeof nested.updatedAt === 'string' ? nested.updatedAt : undefined;

  return {
    _id,
    conversationId,
    sender: normalizeSender(nested.sender ?? nested.senderId, currentUser),
    text,
    createdAt,
    updatedAt,
  };
}
