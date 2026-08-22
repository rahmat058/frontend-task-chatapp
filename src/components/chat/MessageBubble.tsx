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

interface MessageBubbleProps {
  message: Message
  conversation: Conversation
  isMine: boolean
  isGroup: boolean
  showSender: boolean
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

export function MessageBubble({ message, conversation, isMine, isGroup, showSender }: MessageBubbleProps) {
  const pending = isOptimistic(message)
  const timestamp = formatMessageTime(message.createdAt)
  const currentUser = useAuthStore((s) => s.user)
  const knownUsers = useUserDirectory((s) => s.byId)
  const senderName = getSenderName(message, {
    knownUsers,
    members: resolveMembers(conversation, knownUsers, currentUser),
    currentUser,
  })

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

        <div
          className={cn(
            'rounded-[10px] px-3 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap',
            isMine
              ? 'rounded-tr-md border border-[#22513d] bg-[var(--color-bubble-sent)] text-[var(--color-bubble-sent-text)]'
              : 'rounded-tl-md border border-[var(--border-subtle)] bg-[var(--color-bubble-received)] text-[var(--color-bubble-received-text)]',
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
  )
}
