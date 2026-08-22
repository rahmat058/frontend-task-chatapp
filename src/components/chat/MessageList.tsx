'use client'

import { ChevronUp } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { DirectThreadIntro, DayDivider } from './DirectThreadIntro'
import { ScrollToBottom } from './ScrollToBottom'
import { SkeletonLoader } from '@/components/common/SkeletonLoader'
import { Button } from '@/components/common/Button'
import { useMessages } from '@/lib/hooks/useMessages'
import { useResolveUnknownUsers } from '@/lib/hooks/useResolveUnknownUsers'
import { useConversationName } from '@/lib/hooks/useConversationName'
import { useAuthStore } from '@/lib/store/authStore'
import { useUserDirectory } from '@/lib/store/userDirectory'
import { useScrollBehavior } from '@/lib/hooks/useScrollBehavior'
import { formatDayLabel, isSameCalendarDay, toTimestamp } from '@/lib/utils/formatDate'
import { getSenderId, isOwnMessage } from '@/lib/utils/message'
import { idsMatch } from '@/lib/utils/ids'
import { resolveMembers } from '@/lib/utils/conversation'
import type { Conversation, Message } from '@/types/models'

const CLUSTER_MS = 5 * 60 * 1000

interface MessageListProps {
  conversation: Conversation
  onManageGroup?: () => void
}

function isClustered(previous: Message | undefined, current: Message): boolean {
  if (!previous) return false
  if (getSenderId(previous) !== getSenderId(current)) return false
  if (!isSameCalendarDay(previous.createdAt, current.createdAt)) return false
  return Math.abs(toTimestamp(current.createdAt) - toTimestamp(previous.createdAt)) < CLUSTER_MS
}

export function MessageList({ conversation, onManageGroup }: MessageListProps) {
  const user = useAuthStore((s) => s.user)
  const knownUsers = useUserDirectory((s) => s.byId)
  const displayName = useConversationName(conversation)
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useMessages(conversation._id)

  const messages = data?.allMessages ?? []
  const { scrollRef, showScrollButton, hasNewMessages, scrollToBottom } = useScrollBehavior(messages.length)
  useResolveUnknownUsers(conversation, messages, user?._id)

  const isGroup = conversation.type === 'group'
  const showIntro = !hasNextPage
  const peer = resolveMembers(conversation, knownUsers, user).find((member) => !idsMatch(member._id, user?._id))

  if (isLoading) {
    return <SkeletonLoader variant="message" count={8} />
  }

  const intro = <DirectThreadIntro name={displayName} isGroup={isGroup} peer={peer} onManageGroup={onManageGroup} />

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
          intro
        ) : (
          <div className="flex w-full flex-col">
            {showIntro && intro}
            <div className="flex flex-col gap-1 px-6 pb-4">
              {messages.map((message, index) => {
                const previous = messages[index - 1]
                const next = messages[index + 1]
                const showDay = !previous || !isSameCalendarDay(previous.createdAt, message.createdAt)
                const withPrev = !showDay && isClustered(previous, message)
                const withNext =
                  next && isSameCalendarDay(message.createdAt, next.createdAt) && isClustered(message, next)
                const cluster = withPrev && withNext ? 'middle' : withPrev ? 'end' : withNext ? 'start' : 'single'

                return (
                  <div key={message._id} className={index === 0 ? undefined : withPrev ? 'mt-0.5' : 'mt-2'}>
                    {showDay && <DayDivider label={formatDayLabel(message.createdAt)} />}
                    <MessageBubble
                      message={message}
                      conversation={conversation}
                      isMine={isOwnMessage(message, user?._id)}
                      isGroup={isGroup}
                      showSender={!withPrev}
                      cluster={cluster}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showScrollButton && <ScrollToBottom onClick={() => scrollToBottom('smooth')} hasNewMessages={hasNewMessages} />}
    </div>
  )
}
