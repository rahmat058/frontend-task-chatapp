'use client'

import { Users } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  isGroup?: boolean
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
} as const

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4.5 h-4.5',
  lg: 'w-5 h-5',
  xl: 'w-7 h-7',
} as const

const gradients = [
  'from-violet-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-fuchsia-500 to-purple-600',
]

/** Stable per-name color so an avatar looks the same on every render. */
function getGradient(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff
  }
  return gradients[Math.abs(hash) % gradients.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.trim().slice(0, 2).toUpperCase() || '?'
}

export function Avatar({ name, size = 'md', className, isGroup }: AvatarProps) {
  return (
    <div
      className={cn(
        sizes[size],
        'flex items-center justify-center rounded-full bg-gradient-to-br',
        getGradient(name),
        'shrink-0 font-semibold text-white select-none',
        className,
      )}
      aria-label={name}
      title={name}>
      {isGroup ? <Users className={iconSizes[size]} aria-hidden="true" /> : getInitials(name)}
    </div>
  )
}
