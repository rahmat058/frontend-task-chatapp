'use client'

import { Check, Clock } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { formatMessageTime } from '@/lib/utils/formatDate'
import { isOptimistic } from '@/lib/hooks/useMessages'
import { useAuthStore } from '@/lib/store/authStore'
import { useUserDirectory } from '@/lib/store/userDirectory'
import { resolveMembers } from '@/lib/utils/conversation'
import { getSenderName } from '@/lib/utils/message'
import { cn } from '@/lib/utils/cn'
import type { Conversation, Message } from '@/types/models'

export type MessageCluster = 'single' | 'start' | 'middle' | 'end'

interface MessageBubbleProps {
  message: Message
  conversation: Conversation
  isMine: boolean
  isGroup: boolean
  showSender: boolean
  cluster: MessageCluster
}

function DeliveryStatus({ pending }: { pending: boolean }) {
  if (pending) {
    return <Clock className="h-3 w-3" aria-label="Sending" />
  }

  return (
    <span className="inline-flex text-[var(--green-400)]" aria-label="Sent">
      <Check className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
      <Check className="-ml-1.5 h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
    </span>
  )
}

function bubbleRadius(isMine: boolean, cluster: MessageCluster) {
  if (isMine) {
    switch (cluster) {
      case 'start':
        return 'rounded-[20px] rounded-tr-[4px] rounded-br-[10px]'
      case 'middle':
        return 'rounded-[20px] rounded-r-[8px]'
      case 'end':
        return 'rounded-[20px] rounded-br-[4px] rounded-tr-[10px]'
      default:
        return 'rounded-[20px] rounded-br-[4px]'
    }
  }

  switch (cluster) {
    case 'start':
      return 'rounded-[20px] rounded-tl-[4px] rounded-bl-[12px]'
    case 'middle':
      return 'rounded-[20px] rounded-l-[10px]'
    case 'end':
      return 'rounded-[20px] rounded-tl-[10px] rounded-bl-[12px]'
    default:
      return 'rounded-[20px] rounded-tl-[4px]'
  }
}

function BubbleTail({ side }: { side: 'left' | 'right' }) {
  if (side === 'left') {
    return (
      <svg
        className="pointer-events-none absolute top-0 left-[-6px] z-0 h-[14px] w-[10px] text-[var(--color-bubble-received)]"
        viewBox="0 0 10 14"
        aria-hidden="true">
        <path fill="currentColor" d="M10 0H2.2C5 1.4 7.6 6.2 10 14V0Z" />
      </svg>
    )
  }

  return (
    <svg
      className="pointer-events-none absolute right-[-6px] bottom-0 z-0 h-[14px] w-[10px] text-[var(--color-bubble-sent)]"
      viewBox="0 0 10 14"
      aria-hidden="true">
      <path fill="currentColor" d="M0 14h7.8C5 12.6 2.4 7.8 0 0V14Z" />
    </svg>
  )
}

export function MessageBubble({ message, conversation, isMine, isGroup, showSender, cluster }: MessageBubbleProps) {
  const pending = isOptimistic(message)
  const timestamp = formatMessageTime(message.createdAt)
  const currentUser = useAuthStore((s) => s.user)
  const knownUsers = useUserDirectory((s) => s.byId)
  const senderName = getSenderName(message, {
    knownUsers,
    members: resolveMembers(conversation, knownUsers, currentUser),
    currentUser,
  })
  const showTail = isMine ? cluster === 'single' || cluster === 'end' : cluster === 'single' || cluster === 'start'

  return (
    <div className={cn('flex w-full gap-2', isMine ? 'justify-end' : 'justify-start')}>
      {!isMine &&
        (showSender ? (
          <Avatar name={senderName} size="sm" className="mt-0.5" />
        ) : (
          <span className="h-8 w-8 shrink-0" aria-hidden="true" />
        ))}

      <div className={cn('flex w-fit max-w-[68%] flex-col', isMine ? 'items-end' : 'items-start')}>
        {isGroup && !isMine && showSender && (
          <span className="mb-1 px-1 text-xs font-medium text-[var(--text-secondary)]">{senderName}</span>
        )}

        <div className="relative">
          {showTail && <BubbleTail side={isMine ? 'right' : 'left'} />}
          <div
            className={cn(
              'relative z-[1] px-3 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap',
              bubbleRadius(isMine, cluster),
              isMine
                ? 'bg-[var(--color-bubble-sent)] text-[var(--color-bubble-sent-text)]'
                : 'bg-[var(--color-bubble-received)] text-[var(--color-bubble-received-text)]',
              pending && 'opacity-70',
            )}>
            <p>{message.text}</p>
            <span
              className={cn(
                'mt-1.5 flex items-center gap-1 text-[11px] tabular-nums',
                isMine ? 'justify-end text-[var(--green-300)]' : 'justify-end text-[var(--text-muted)]',
              )}>
              {timestamp}
              {isMine && <DeliveryStatus pending={pending} />}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
