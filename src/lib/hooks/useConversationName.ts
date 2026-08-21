'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { useUserDirectory } from '@/lib/store/userDirectory'
import { getConversationName } from '@/lib/utils/conversation'
import type { Conversation } from '@/types/models'

export function useConversationName(conversation: Conversation): string {
  const userId = useAuthStore((s) => s.user?._id)
  const knownUsers = useUserDirectory((s) => s.byId)
  const peer = useUserDirectory((s) => s.byConversationId[conversation._id])
  return getConversationName(conversation, userId, knownUsers, peer)
}
