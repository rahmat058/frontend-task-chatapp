'use client';

import { Check, Clock } from 'lucide-react';
import { formatMessageTime } from '@/lib/utils/formatDate';
import { isOptimistic } from '@/lib/hooks/useMessages';
import { cn } from '@/lib/utils/cn';
import type { Message } from '@/types/models';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  isGroup: boolean;
  showSender: boolean;
}

export function MessageBubble({
  message,
  isMine,
  isGroup,
  showSender,
}: MessageBubbleProps) {
  const pending = isOptimistic(message);
  const timestamp = formatMessageTime(message.createdAt);

  return (
    <div
      className={cn(
        'flex',
        isMine
          ? 'justify-end animate-slide-in-right'
          : 'justify-start animate-slide-in-left'
      )}
    >
      <div
        className={cn(
          'flex flex-col max-w-[72%] sm:max-w-[60%]',
          isMine ? 'items-end' : 'items-start'
        )}
      >
        {isGroup && !isMine && showSender && (
          <span className="text-[11px] font-medium text-[var(--color-primary)] mb-0.5 px-1">
            {message.sender?.name ?? 'Unknown'}
          </span>
        )}

        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap',
            isMine
              ? 'bg-[var(--color-bubble-sent)] text-[var(--color-bubble-sent-text)] rounded-tr-sm'
              : 'bg-[var(--color-bubble-received)] text-[var(--color-bubble-received-text)] rounded-tl-sm border border-[var(--color-border)]',
            pending && 'opacity-70'
          )}
        >
          {message.text}
        </div>

        <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] mt-0.5 px-1">
          {timestamp}
          {isMine &&
            (pending ? (
              <Clock className="w-3 h-3" aria-label="Sending" />
            ) : (
              <Check className="w-3 h-3" aria-label="Sent" />
            ))}
        </span>
      </div>
    </div>
  );
}
