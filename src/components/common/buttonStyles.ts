import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:shadow-[var(--focus-ring)]'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--green-600)] text-[var(--text-primary)] hover:bg-[var(--green-500)] active:bg-[var(--green-700)]',
  secondary:
    'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-hover)]',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
  danger:
    'bg-[var(--danger-soft)] text-[var(--danger)] border border-[color-mix(in_srgb,var(--danger)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--danger)_16%,transparent)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
  icon: 'h-11 w-11 p-0',
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}) {
  return cn(baseStyles, variants[variant], sizes[size], className)
}
