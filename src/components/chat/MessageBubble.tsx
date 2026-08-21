'use client'

import { Check, Clock } from 'lucide-react'
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
    <div className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-[68%] flex-col', isMine ? 'items-end' : 'items-start')}>
        {isGroup && !isMine && showSender && (
          <span className="mb-1 px-1 text-xs font-medium text-[var(--text-secondary)]">{senderName}</span>
        )}

        <div
          className={cn(
            'rounded-[10px] px-3 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap',
            isMine
              ? 'rounded-tr-md border border-[#22513d] bg-[#123d2c] text-[var(--text-primary)]'
              : 'rounded-tl-md border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-primary)]',
            pending && 'opacity-70',
          )}>
          {message.text}
        </div>

        <span className="mt-1 flex items-center gap-1 px-1 text-xs text-[var(--text-muted)] tabular-nums">
          {timestamp}
          {isMine &&
            (pending ? (
              <Clock className="h-3 w-3" aria-label="Sending" />
            ) : (
              <Check className="h-3 w-3" aria-label="Sent" />
            ))}
        </span>
      </div>
    </div>
  )
}
