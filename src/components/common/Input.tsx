'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  valid?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leading?: React.ReactNode
  prefix?: string
  /** Wait this long after the last keystroke before calling `onChange`. Empty values flush immediately. */
  debounceMs?: number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function emitValue(onChange: React.ChangeEventHandler<HTMLInputElement> | undefined, value: string) {
  onChange?.({ target: { value } } as React.ChangeEvent<HTMLInputElement>)
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      valid,
      leftIcon,
      rightIcon,
      leading,
      prefix,
      className,
      id,
      debounceMs = 0,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = error ? `${inputId}-error` : undefined
    const debounce = debounceMs > 0
    const timerRef = useRef<number>(0)
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    const [localValue, setLocalValue] = useState(() => String(value ?? defaultValue ?? ''))

    useEffect(() => {
      if (!debounce) return
      setLocalValue(String(value ?? ''))
    }, [debounce, value])

    useEffect(() => {
      return () => window.clearTimeout(timerRef.current)
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value

      if (!debounce) {
        onChange?.(event)
        return
      }

      setLocalValue(next)
      window.clearTimeout(timerRef.current)

      if (next.trim().length === 0) {
        emitValue(onChangeRef.current, next)
        return
      }

      timerRef.current = window.setTimeout(() => {
        emitValue(onChangeRef.current, next)
      }, debounceMs)
    }

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
              rightIcon && 'pr-11',
              valid &&
                !error &&
                'border-[var(--green-400)] focus:border-[var(--green-400)] focus:shadow-[var(--focus-ring)]',
              error &&
                'border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_var(--danger-soft)]',
              className,
            )}
            {...props}
            value={debounce ? localValue : value}
            defaultValue={debounce ? undefined : defaultValue}
            onChange={handleChange}
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
