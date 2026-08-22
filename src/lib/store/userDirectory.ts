'use client'

import { create } from 'zustand'
import { getEntityId, idsMatch } from '@/lib/utils/ids'
import type { User } from '@/types/models'

export type DirectoryUser = Pick<User, '_id' | 'name'> & { phone?: string }

interface UserDirectoryState {
  byId: Record<string, DirectoryUser>
  byConversationId: Record<string, DirectoryUser>
  remember: (users: unknown[]) => void
  rememberPeer: (conversationId: string, user: unknown) => void
}

const STORAGE_KEY = 'chat_user_directory'

function empty() {
  return { byId: {} as Record<string, DirectoryUser>, byConversationId: {} as Record<string, DirectoryUser> }
}

function load() {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const src = parsed.state && typeof parsed.state === 'object' ? (parsed.state as Record<string, unknown>) : parsed
    return {
      byId: src.byId && typeof src.byId === 'object' ? (src.byId as Record<string, DirectoryUser>) : {},
      byConversationId:
        src.byConversationId && typeof src.byConversationId === 'object'
          ? (src.byConversationId as Record<string, DirectoryUser>)
          : {},
    }
  } catch {
    return empty()
  }
}

function save(state: { byId: Record<string, DirectoryUser>; byConversationId: Record<string, DirectoryUser> }) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function toDirectoryUser(value: unknown): DirectoryUser | null {
  const id = getEntityId(value)
  if (!id || !value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const nestedUser = record.user && typeof record.user === 'object' ? record.user : null
  const nameSource = (nestedUser ?? record) as Record<string, unknown>
  const name = nameSource.name
  if (typeof name !== 'string') return null
  const trimmed = name.trim()
  if (!trimmed || /^direct message$/i.test(trimmed) || trimmed === 'Unknown') {
    return null
  }

  const phone = nameSource.phone ?? record.phone
  return {
    _id: id,
    name: trimmed,
    ...(typeof phone === 'string' && phone ? { phone } : {}),
  }
}

export function findKnownUser(byId: Record<string, DirectoryUser>, id?: string | null): DirectoryUser | undefined {
  if (!id) return undefined
  if (byId[id]) return byId[id]
  return Object.values(byId).find((user) => idsMatch(user._id, id))
}

const initial = load()

/**
 * Live `GET /conversations` returns participant ids only. Names are learned
 * when a user is searched or a DM is started, then keyed by both user id
 * and conversation id so the sidebar can resolve "rosdev" after a refetch.
 */
export const useUserDirectory = create<UserDirectoryState>((set, get) => ({
  byId: initial.byId,
  byConversationId: initial.byConversationId,

  remember: (users) => {
    let changed = false
    const byId = { ...get().byId }

    for (const user of users) {
      const next = toDirectoryUser(user)
      if (!next) continue
      const prev = byId[next._id]
      if (prev?.name === next.name && prev?.phone === next.phone) continue
      byId[next._id] = { ...prev, ...next }
      changed = true
    }

    if (!changed) return
    const nextState = { byId, byConversationId: get().byConversationId }
    save(nextState)
    set({ byId })
  },

  rememberPeer: (conversationId, user) => {
    const entry = toDirectoryUser(user)
    if (!conversationId || !entry) return

    const byId = {
      ...get().byId,
      [entry._id]: { ...get().byId[entry._id], ...entry },
    }
    const byConversationId = {
      ...get().byConversationId,
      [conversationId]: entry,
    }
    save({ byId, byConversationId })
    set({ byId, byConversationId })
  },
}))
