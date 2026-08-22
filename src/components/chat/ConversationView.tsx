'use client'

import { useEffect } from 'react'
import { useConversations } from '@/lib/hooks/useConversations'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { ErrorState } from '@/components/common/ErrorState'
import { SkeletonLoader } from '@/components/common/SkeletonLoader'
import { useUIStore } from '@/lib/store/uiStore'
import { idsMatch } from '@/lib/utils/ids'

export function ConversationView({ conversationId }: { conversationId: string }) {
  const { data: conversations, isLoading, isFetching, isPending, error, refetch } = useConversations()
  const clearUnread = useUIStore((s) => s.clearUnread)
  const setActiveConversation = useUIStore((s) => s.setActiveConversation)

  useEffect(() => {
    setActiveConversation(conversationId)
    clearUnread(conversationId)
  }, [conversationId, clearUnread, setActiveConversation])

  const conversation = conversations?.find((c) => idsMatch(c._id, conversationId))

  if (!conversation && (isPending || isLoading || isFetching)) {
    return <SkeletonLoader variant="message" count={6} />
  }

  if (error && !conversation) {
    return <ErrorState description="Failed to load this conversation." onRetry={() => void refetch()} />
  }

  if (!conversation) {
    return (
      <ErrorState
        title="Conversation not found"
        description="This conversation may have been deleted, or you may not have access to it."
        onRetry={() => void refetch()}
      />
    )
  }

  return <ChatPanel conversation={conversation} />
}
