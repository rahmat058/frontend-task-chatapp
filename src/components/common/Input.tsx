'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  valid?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leading?: React.ReactNode
  prefix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, valid, leftIcon, rightIcon, leading, prefix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-xs leading-[1.3] font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leading && <div className="absolute left-1.5 z-10 flex items-center">{leading}</div>}
          {leftIcon && !leading && (
            <span className="pointer-events-none absolute left-3 text-[var(--text-muted)]">{leftIcon}</span>
          )}
          {prefix && !leading && (
            <span
              className={cn(
                'pointer-events-none absolute text-sm font-medium text-[var(--text-secondary)] select-none',
                leftIcon ? 'left-10' : 'left-4',
              )}
              aria-hidden="true">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            className={cn(
              'h-11 w-full rounded-[var(--radius-md)] px-4 py-2 text-sm',
              'border border-[var(--border-default)] bg-[var(--surface-2)]',
              'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
              'transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
              'focus:border-[var(--green-400)] focus:shadow-[var(--focus-ring)] focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && !prefix && !leading && 'pl-10',
              leftIcon && prefix && !leading && 'pl-[5.75rem]',
              !leftIcon && prefix && !leading && 'pl-16',
              leading && 'pl-[8.25rem]',
              rightIcon && 'pr-11',
              valid &&
                !error &&
                'border-[var(--green-400)] focus:border-[var(--green-400)] focus:shadow-[var(--focus-ring)]',
              error &&
                'border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_var(--danger-soft)]',
              className,
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-2 flex items-center text-[var(--text-muted)]">{rightIcon}</div>}
        </div>
        {error && (
          <p id={errorId} className="mt-[-2px] text-xs leading-[1.45] text-[var(--danger)]">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
