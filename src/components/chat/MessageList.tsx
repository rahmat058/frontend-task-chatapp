'use client'

import { ChevronUp, MessagesSquare, Users } from 'lucide-react'
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

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex min-h-full items-center justify-center px-6">
            <EmptyState
              icon={isGroup ? <Users className="h-6 w-6" /> : <MessagesSquare className="h-6 w-6" />}
              title="No messages yet"
              description="Say hello to start the conversation."
            />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2 px-6 py-4">
            {messages.map((message, index) => {
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
            })}
          </div>
        )}
      </div>

      {showScrollButton && <ScrollToBottom onClick={() => scrollToBottom('smooth')} hasNewMessages={hasNewMessages} />}
    </div>
  )
}
