'use client'

import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { SendHorizontal, X } from 'lucide-react'
import { useSendMessage } from '@/lib/hooks/useMessages'
import { getApiErrorMessage } from '@/lib/api/normalize'
import { cn } from '@/lib/utils/cn'

interface MessageInputProps {
  conversationId: string
}

interface MessageValues {
  text: string
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<MessageValues>({
    defaultValues: { text: '' },
  })

  const text = watch('text')
  const canSend = text.trim().length > 0 && !isPending
  const { ref: registerRef, onChange, ...textField } = register('text')

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }

  const onSend = ({ text: raw }: MessageValues) => {
    const trimmed = raw.trim()
    if (!trimmed || isPending) return

    reset({ text: '' })
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    clearErrors('root')

    sendMessage(trimmed, {
      onError: (err) => {
        setError('root', {
          message: getApiErrorMessage(err, 'Message failed to send.'),
        })
        setValue('text', trimmed)
      },
    })
  }

  return (
    <form
      className="shrink-0 bg-[var(--color-surface-1)] border-t border-[var(--color-border)]"
      onSubmit={handleSubmit(onSend)}
      noValidate
    >
      {errors.root?.message && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-2 text-xs text-red-300 bg-red-500/10 border-b border-red-500/20"
          role="alert"
        >
          <span>{errors.root.message}</span>
          <button
            type="button"
            onClick={() => clearErrors('root')}
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
            {...textField}
            ref={(el) => {
              registerRef(el)
              textareaRef.current = el
            }}
            onChange={(e) => {
              void onChange(e)
              resize(e.target)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void handleSubmit(onSend)()
              }
            }}
            placeholder="Type a message…"
            rows={1}
            aria-label="Message input"
            className={cn(
              'flex-1 resize-none bg-transparent px-4 py-3 text-sm',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none leading-relaxed',
              'min-h-[44px] max-h-[140px] overflow-y-auto',
            )}
          />
        </div>

        <button
          id="send-message-btn"
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            'w-11 h-11 rounded-md flex items-center justify-center shrink-0',
            'bg-[var(--color-primary)] text-white',
            'transition-all duration-150 active:scale-95',
            'hover:bg-[var(--color-primary-hover)]',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]',
          )}
        >
          <SendHorizontal className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
