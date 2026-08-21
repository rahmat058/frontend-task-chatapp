'use client';

import { useState, useRef } from 'react';
import { useSendMessage } from '@/lib/hooks/useMessages';
import { useSocket } from '@/lib/hooks/useSocket';
import { SOCKET_EVENTS } from '@/types/socket';

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId);
  const { socket } = useSocket();

  const canSend = text.trim().length > 0 && !isPending;

  const handleSend = () => {
    if (!canSend) return;
    const trimmed = text.trim();
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    // Send via REST (optimistic) — socket event is bonus
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-grow textarea
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div className="flex items-end gap-2 px-4 py-3 bg-[var(--color-surface-1)] border-t border-[var(--color-border)] shrink-0">
      <div className="flex-1 flex items-end bg-[var(--color-surface-2)] rounded-2xl border border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-soft)] transition-all duration-150">
        <textarea
          id="message-input"
          ref={textareaRef}
          value={text}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          aria-label="Message input"
          className="
            flex-1 resize-none bg-transparent px-4 py-3 text-sm
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none leading-relaxed
            min-h-[44px] max-h-[140px] overflow-y-auto
          "
        />
      </div>

      <button
        id="send-message-btn"
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
        className="
          w-11 h-11 rounded-2xl flex items-center justify-center shrink-0
          transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          active:scale-95
          bg-[var(--color-primary)] text-white
          hover:bg-[var(--color-primary-hover)] disabled:hover:bg-[var(--color-primary)]
        "
      >
        <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
}
