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
      className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--surface-1)] pb-[env(safe-area-inset-bottom)]"
      onSubmit={handleSubmit(onSend)}
      noValidate>
      {errors.root?.message && (
        <div
          className="flex items-center justify-between gap-3 border-b border-[var(--danger)]/20 bg-[var(--danger-soft)] px-4 py-2 text-xs text-[var(--danger)]"
          role="alert">
          <span>{errors.root.message}</span>
          <button
            type="button"
            onClick={() => clearErrors('root')}
            aria-label="Dismiss error"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)]">
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex min-h-[72px] items-end gap-2 px-4 py-3">
        <div className="flex flex-1 items-end rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-2)] transition-[border-color,box-shadow] duration-[var(--duration-fast)] focus-within:border-[var(--green-400)] focus-within:shadow-[var(--focus-ring)]">
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
            aria-label="Message"
            className={cn(
              'flex-1 resize-none bg-transparent px-4 py-3 text-sm',
              'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
              'leading-relaxed focus:outline-none',
              'max-h-[140px] min-h-12 overflow-y-auto',
            )}
          />
        </div>

        <button
          id="send-message-btn"
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)]',
            'bg-[var(--green-600)] text-[var(--text-primary)]',
            'transition-colors duration-[var(--duration-fast)]',
            'hover:bg-[var(--green-500)]',
            'focus-visible:shadow-[var(--focus-ring)]',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--green-600)]',
          )}>
          <SendHorizontal className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
