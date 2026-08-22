'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Ellipsis } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils/cn'

export type OverflowMenuItem = {
  id: string
  label: string
  disabled?: boolean
  danger?: boolean
  onSelect: () => void
}

export function OverflowMenu({
  label,
  items,
  disabled,
}: {
  label: string
  items: OverflowMenuItem[]
  disabled?: boolean
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const place = () => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const menuWidth = 220
    const left = Math.min(Math.max(8, rect.right - menuWidth), window.innerWidth - menuWidth - 8)
    const below = rect.bottom + 6
    const estimatedHeight = 8 + items.length * 44
    const top = below + estimatedHeight > window.innerHeight - 8 ? rect.top - estimatedHeight - 6 : below
    setCoords({ top, left })
  }

  useEffect(() => {
    if (!open) return
    place()
    const close = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onReposition = () => place()
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, items.length])

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}>
        <Ellipsis className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
      </Button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={label}
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-[70] w-[220px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-1)] py-1 shadow-[var(--shadow-dialog)]">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={cn(
                  'flex min-h-11 w-full items-center px-3 text-left text-sm',
                  item.danger ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]',
                  item.disabled ? 'cursor-not-allowed text-[var(--text-disabled)]' : 'hover:bg-[var(--surface-hover)]',
                )}
                onClick={() => {
                  if (item.disabled) return
                  setOpen(false)
                  item.onSelect()
                }}>
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
