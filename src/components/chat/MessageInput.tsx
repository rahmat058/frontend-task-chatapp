'use client'

import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Paperclip, Send, X } from 'lucide-react'
import { EmojiPicker } from './EmojiPicker'
import { useSendMessage } from '@/lib/hooks/useMessages'
import { useConversationName } from '@/lib/hooks/useConversationName'
import { getApiErrorMessage } from '@/lib/api/normalize'
import { cn } from '@/lib/utils/cn'
import type { Conversation } from '@/types/models'

interface MessageInputProps {
  conversation: Conversation
}

interface MessageValues {
  text: string
}

export function MessageInput({ conversation }: MessageInputProps) {
  const conversationId = conversation._id
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId)
  const peerName = useConversationName(conversation)
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

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current
    const current = text ?? ''
    const start = el?.selectionStart ?? current.length
    const end = el?.selectionEnd ?? current.length
    const next = `${current.slice(0, start)}${emoji}${current.slice(end)}`

    setValue('text', next, { shouldDirty: true })
    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      const caret = start + emoji.length
      el.setSelectionRange(caret, caret)
      resize(el)
    })
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

      <div className="flex min-h-[72px] items-end px-4 py-3">
        <div className="flex flex-1 items-end gap-1 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-2)] p-0.5 transition-[border-color,box-shadow] duration-[var(--duration-fast)] focus-within:border-[var(--green-400)] focus-within:shadow-[var(--focus-ring)]">
          <button
            type="button"
            aria-disabled="true"
            title="Attachments coming soon"
            aria-label="Attach a file — coming soon"
            onClick={(event) => event.preventDefault()}
            className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-[var(--radius-md)] text-[var(--text-disabled)] focus-visible:shadow-[var(--focus-ring)]">
            <Paperclip className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </button>

          <span className="my-2 w-px self-stretch bg-[var(--border-subtle)]" aria-hidden="true" />

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
            placeholder={`Message ${peerName}…`}
            rows={1}
            aria-label="Message"
            className={cn(
              'flex-1 resize-none bg-transparent px-3 py-3 text-sm',
              'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
              'leading-relaxed focus:outline-none',
              'max-h-[140px] min-h-11 overflow-y-auto',
            )}
          />

          <EmojiPicker onSelect={insertEmoji} disabled={isPending} />

          <button
            id="send-message-btn"
            type="submit"
            disabled={!canSend}
            title="Send message"
            aria-label="Send message"
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              'bg-[var(--green-600)] text-[var(--text-primary)]',
              'transition-colors duration-[var(--duration-fast)]',
              'hover:bg-[var(--green-500)]',
              'focus-visible:shadow-[var(--focus-ring)]',
              'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--green-600)]',
            )}>
            <Send
              className="h-[17px] w-[17px] translate-x-px"
              fill="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </form>
  )
}
