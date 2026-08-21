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
    <div className={cn('flex', isMine ? 'animate-slide-in-right justify-end' : 'animate-slide-in-left justify-start')}>
      <div className={cn('flex max-w-[72%] flex-col sm:max-w-[60%]', isMine ? 'items-end' : 'items-start')}>
        {isGroup && !isMine && showSender && (
          <span className="mb-0.5 px-1 text-[11px] font-medium text-[var(--color-primary)]">
            {senderName}
          </span>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap',
            isMine
              ? 'rounded-tr-sm bg-[var(--color-bubble-sent)] text-[var(--color-bubble-sent-text)]'
              : 'rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-bubble-received)] text-[var(--color-bubble-received-text)]',
            pending && 'opacity-70',
          )}>
          {message.text}
        </div>

        <span className="mt-0.5 flex items-center gap-1 px-1 text-[10px] text-[var(--color-text-muted)]">
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
