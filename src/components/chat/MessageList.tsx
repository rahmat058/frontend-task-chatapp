'use client'

import { ChevronUp, MessagesSquare } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { ScrollToBottom } from './ScrollToBottom'
import { SkeletonLoader } from '@/components/common/SkeletonLoader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/common/Button'
import { useMessages } from '@/lib/hooks/useMessages'
import { useResolveUnknownUsers } from '@/lib/hooks/useResolveUnknownUsers'
import { useAuthStore } from '@/lib/store/authStore'
import { useScrollBehavior } from '@/lib/hooks/useScrollBehavior'
import { getSenderId, isOwnMessage } from '@/lib/utils/message'
import type { Conversation } from '@/types/models'

interface MessageListProps {
  conversation: Conversation
}

export function MessageList({ conversation }: MessageListProps) {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useMessages(conversation._id)

  const messages = data?.allMessages ?? []
  const { scrollRef, showScrollButton, hasNewMessages, scrollToBottom } = useScrollBehavior(messages.length)
  useResolveUnknownUsers(conversation, messages, user?._id)

  const isGroup = conversation.type === 'group'

  if (isLoading) {
    return <SkeletonLoader variant="message" count={8} />
  }

  return (
    <div className="relative flex h-full flex-col">
      {hasNextPage && (
        <div className="flex shrink-0 justify-center py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            leftIcon={<ChevronUp className="h-3.5 w-3.5" />}
            className="text-xs">
            {isFetchingNextPage ? 'Loading…' : 'Load older messages'}
          </Button>
        </div>
      )}

      <div ref={scrollRef} className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="h-6 w-6" />}
            title="No messages yet"
            description="Say hello to start the conversation."
          />
        ) : (
          messages.map((message, index) => {
            const previous = messages[index - 1]
            return (
              <MessageBubble
                key={message._id}
                message={message}
                conversation={conversation}
                isMine={isOwnMessage(message, user?._id)}
                isGroup={isGroup}
                showSender={getSenderId(previous) !== getSenderId(message)}
              />
            )
          })
        )}
      </div>

      {showScrollButton && <ScrollToBottom onClick={() => scrollToBottom('smooth')} hasNewMessages={hasNewMessages} />}
    </div>
  )
}
