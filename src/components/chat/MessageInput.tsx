'use client';

import { useState, useRef } from 'react';
import { SendHorizontal, X } from 'lucide-react';
import { useSendMessage } from '@/lib/hooks/useMessages';
import { getApiErrorMessage } from '@/lib/api/normalize';
import { cn } from '@/lib/utils/cn';

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId);

  const canSend = text.trim().length > 0 && !isPending;

  const handleSend = () => {
    if (!canSend) return;
    const trimmed = text.trim();
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setError(null);
    sendMessage(trimmed, {
      onError: (err) => {
        setError(getApiErrorMessage(err, 'Message failed to send.'));
        // Restore the text so the send can be retried without retyping.
        setText((current) => (current.length === 0 ? trimmed : current));
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div className="shrink-0 bg-[var(--color-surface-1)] border-t border-[var(--color-border)]">
      {error && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-2 text-xs text-red-300 bg-red-500/10 border-b border-red-500/20"
          role="alert"
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="shrink-0 rounded-md p-0.5 hover:text-red-200"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 px-4 py-3">
        <div className="flex-1 flex items-end bg-[var(--color-surface-2)] rounded-md border border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-soft)] transition-all duration-150">
          <textarea
            id="message-input"
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            aria-label="Message input"
            className={cn(
              'flex-1 resize-none bg-transparent px-4 py-3 text-sm',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none leading-relaxed',
              'min-h-[44px] max-h-[140px] overflow-y-auto'
            )}
          />
        </div>

        <button
          id="send-message-btn"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            'w-11 h-11 rounded-md flex items-center justify-center shrink-0',
            'bg-[var(--color-primary)] text-white',
            'transition-all duration-150 active:scale-95',
            'hover:bg-[var(--color-primary-hover)]',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]'
          )}
        >
          <SendHorizontal className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
