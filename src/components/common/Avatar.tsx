'use client'

import { Users } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  isGroup?: boolean
  online?: boolean
}

const sizes = {
  sm: 'h-8 w-8 text-[12px]',
  md: 'h-10 w-10 text-[13px]',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-[22px]',
} as const

const iconSizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-7 w-7',
  '2xl': 'h-8 w-8',
} as const

const presence = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
  '2xl': 'h-5 w-5',
} as const

/** Moderate, readable fills — not neon and not a purple brand. */
const fills = ['#1d4a45', '#2a3f54', '#3d3a28', '#3b2f3a', '#2c3d32', '#3a3328']

function getFill(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff
  }
  return fills[Math.abs(hash) % fills.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.trim().slice(0, 2).toUpperCase() || '?'
}

export function Avatar({ name, size = 'md', className, isGroup, online }: AvatarProps) {
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          sizes[size],
          'flex items-center justify-center rounded-full font-semibold text-[var(--text-primary)] select-none',
        )}
        style={{ backgroundColor: getFill(name) }}
        aria-label={name}
        title={name}>
        {isGroup ? <Users className={iconSizes[size]} strokeWidth={1.75} aria-hidden="true" /> : getInitials(name)}
      </span>
      {online && (
        <span
          className={cn(
            presence[size],
            'absolute right-0 bottom-0 rounded-full border-2 border-[var(--bg-app)] bg-[var(--green-500)]',
          )}
          aria-label="Online"
        />
      )}
    </span>
  )
}
