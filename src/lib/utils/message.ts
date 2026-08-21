import type { Message, User } from '@/types/models'
import { findKnownUser, useUserDirectory } from '@/lib/store/userDirectory'
import { getEntityId, idsMatch } from './ids'

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

const PLACEHOLDER_SENDER_NAMES = new Set(['unknown', 'member', 'you', 'direct message', 'direct', 'dm'])

export function isRealDisplayName(name?: string | null): name is string {
  if (!name) return false
  const trimmed = name.trim()
  return trimmed.length > 0 && !PLACEHOLDER_SENDER_NAMES.has(trimmed.toLowerCase())
}

function nameFromValue(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const rec = asRecord(value)
  if (!rec) return undefined
  for (const key of ['name', 'displayName', 'fullName', 'username', 'userName']) {
    const candidate = rec[key]
    if (typeof candidate === 'string' && isRealDisplayName(candidate)) return candidate.trim()
  }
  return nameFromValue(rec.user)
}

export function getSenderId(
  message?: {
    sender?: unknown
    senderId?: unknown
  } | null,
): string | undefined {
  if (!message) return undefined
  return getEntityId(message.sender) ?? getEntityId(message.senderId)
}

export function getSenderName(
  message: { sender?: unknown; senderId?: unknown },
  options?: {
    knownUsers?: Record<string, Pick<User, '_id' | 'name'>>
    members?: Array<Pick<User, '_id' | 'name'>>
    currentUser?: User | null
  },
): string {
  const id = getSenderId(message)

  if (options?.currentUser && idsMatch(id, options.currentUser._id) && isRealDisplayName(options.currentUser.name)) {
    return options.currentUser.name.trim()
  }

  const fromSender = nameFromValue(message.sender)
  if (fromSender) return fromSender

  const known = findKnownUser(options?.knownUsers ?? {}, id)
  if (isRealDisplayName(known?.name)) return known.name.trim()

  const member = options?.members?.find((person) => idsMatch(person._id, id))
  if (isRealDisplayName(member?.name)) return member.name.trim()

  return 'Unknown'
}

export function isOwnMessage(
  message: { sender?: unknown; senderId?: unknown },
  currentUserId?: string | null,
): boolean {
  return idsMatch(getSenderId(message), currentUserId)
}

export function normalizeSender(raw: unknown, currentUser?: User | null): Pick<User, '_id' | 'name'> {
  const id = getEntityId(raw) ?? ''
  const nameFromObject = nameFromValue(raw)

  if (nameFromObject) return { _id: id, name: nameFromObject }
  if (currentUser && idsMatch(id, currentUser._id)) {
    return { _id: id || currentUser._id, name: currentUser.name }
  }
  const known = findKnownUser(useUserDirectory.getState().byId, id)
  if (isRealDisplayName(known?.name)) {
    return { _id: id || known._id, name: known.name }
  }
  return { _id: id, name: known?.name ?? '' }
}

/**
 * Coerce whatever the API or socket actually sent into the Message shape
 * the UI compares against. Bare sender ids become `{ _id }` so own messages
 * stay right-aligned after confirmation.
 */
export function normalizeMessage(raw: unknown, currentUser?: User | null): Message | null {
  const obj = asRecord(raw)
  if (!obj) return null

  const nested = asRecord(obj.message) ?? (asRecord(obj.data) && !obj.text ? asRecord(obj.data) : null) ?? obj

  const _id = getEntityId(nested._id ?? nested.id)
  if (!_id) return null

  const conversationId = getEntityId(nested.conversationId) ?? getEntityId(nested.conversation) ?? ''

  const text = typeof nested.text === 'string' ? nested.text : ''
  const createdAt = typeof nested.createdAt === 'string' ? nested.createdAt : new Date().toISOString()
  const updatedAt = typeof nested.updatedAt === 'string' ? nested.updatedAt : undefined

  const sender = normalizeSender(nested.sender ?? nested.senderId ?? nested.user, currentUser)
  const extraName =
    (typeof nested.senderName === 'string' && nested.senderName) ||
    (typeof nested.userName === 'string' && nested.userName) ||
    ''

  return {
    _id,
    conversationId,
    sender:
      !isRealDisplayName(sender.name) && isRealDisplayName(extraName) ? { ...sender, name: extraName.trim() } : sender,
    text,
    createdAt,
    updatedAt,
  }
}
