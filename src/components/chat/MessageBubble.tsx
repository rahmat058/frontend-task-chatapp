'use client';

import { formatMessageTime } from '@/lib/utils/formatDate';
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
  const isOptimistic = message._id.startsWith('optimistic-');

  return (
    <div
      className={`flex ${isMine ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'}`}
    >
      <div
        className={`
          flex flex-col max-w-[72%] sm:max-w-[60%]
          ${isMine ? 'items-end' : 'items-start'}
        `}
      >
        {/* Sender name (group only, for received messages) */}
        {isGroup && !isMine && showSender && (
          <span className="text-[11px] font-medium text-[var(--color-primary)] mb-0.5 px-1">
            {message.sender.name}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`
            px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
            ${isMine
              ? 'bg-[var(--color-bubble-sent)] text-[var(--color-bubble-sent-text)] rounded-tr-sm'
              : 'bg-[var(--color-bubble-received)] text-[var(--color-bubble-received-text)] rounded-tl-sm border border-[var(--color-border)]'}
            ${isOptimistic ? 'opacity-70' : 'opacity-100'}
          `}
        >
          {message.text}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5 px-1">
          {formatMessageTime(message.createdAt)}
          {isMine && isOptimistic && (
            <span className="ml-1 opacity-60">· sending</span>
          )}
        </span>
      </div>
    </div>
  );
}
