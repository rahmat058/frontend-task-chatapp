'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Smile } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const groups = [
  {
    label: 'Smileys',
    emoji: ['😀', '😄', '😅', '🤣', '🙂', '😉', '😍', '😘', '😜', '🤔', '😐', '😴', '😢', '😭', '😤', '😱'],
  },
  {
    label: 'Gestures',
    emoji: ['👍', '👎', '👌', '🙌', '👏', '🙏', '🤝', '💪', '👋', '🤞', '✌️', '🫡'],
  },
  {
    label: 'Hearts',
    emoji: ['❤️', '🧡', '💚', '💙', '💜', '🖤', '💔', '💯'],
  },
  {
    label: 'Objects',
    emoji: ['🔥', '✨', '🎉', '🎂', '☕', '🍕', '⚽', '🚀', '📎', '📌', '⏰', '✅'],
  },
]

const POPOVER_WIDTH = 288
const POPOVER_HEIGHT = 296

export function EmojiPicker({ onSelect, disabled }: { onSelect: (emoji: string) => void; disabled?: boolean }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const place = () => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const left = Math.min(Math.max(8, rect.right - POPOVER_WIDTH), window.innerWidth - POPOVER_WIDTH - 8)
    const above = rect.top - POPOVER_HEIGHT - 8
    setCoords({ top: above < 8 ? rect.bottom + 8 : above, left })
  }

  const close = (returnFocus = true) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    place()

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        close()
      }
    }
    const onReposition = () => place()

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        title="Emoji"
        aria-label="Insert emoji"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)]',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
          'hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
          'focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50',
          open ? 'text-[var(--green-400)]' : 'text-[var(--text-muted)]',
        )}>
        <Smile className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label="Emoji"
            style={{ top: coords.top, left: coords.left, width: POPOVER_WIDTH }}
            className="fixed z-[70] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-1)] p-2 shadow-[var(--shadow-dialog)]">
            <div className="max-h-[264px] overflow-y-auto">
              {groups.map((group) => (
                <div key={group.label} className="mb-2 last:mb-0">
                  <p className="px-1 pb-1 text-[11px] font-medium tracking-wide text-[var(--text-muted)] uppercase">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-8 gap-0.5">
                    {group.emoji.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        aria-label={emoji}
                        onClick={() => {
                          onSelect(emoji)
                          close(false)
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-lg leading-none hover:bg-[var(--surface-hover)] focus-visible:shadow-[var(--focus-ring)]">
                        <span aria-hidden="true">{emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
