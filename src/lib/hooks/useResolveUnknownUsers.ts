'use client'

import { useEffect } from 'react'
import { usersApi } from '@/lib/api/users'
import { findKnownUser, useUserDirectory } from '@/lib/store/userDirectory'
import { getParticipantIds } from '@/lib/utils/conversation'
import { getSenderId } from '@/lib/utils/message'
import { idsMatch } from '@/lib/utils/ids'
import type { Conversation, Message } from '@/types/models'

const attempted = new Set<string>()

/**
 * Message and conversation payloads often include user ids only. Search by
 * that id so group sender labels can resolve to a real name when the API
 * allows it, and so later bubbles pick the name up from the directory.
 */
export function useResolveUnknownUsers(conversation: Conversation, messages: Message[], currentUserId?: string) {
  const byId = useUserDirectory((s) => s.byId)

  useEffect(() => {
    const ids = new Set(getParticipantIds(conversation))
    for (const message of messages) {
      const id = getSenderId(message)
      if (id) ids.add(id)
    }

    for (const id of ids) {
      if (!id || attempted.has(id) || idsMatch(id, currentUserId) || findKnownUser(byId, id)) {
        continue
      }
      attempted.add(id)
      void usersApi.search(id).catch(() => {
        attempted.delete(id)
      })
    }
  }, [byId, conversation, currentUserId, messages])
}
