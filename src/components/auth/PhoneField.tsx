'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { COUNTRY_CODE, LOCAL_DIGITS } from '@/lib/utils/phone'

function BangladeshMark() {
  return (
    <svg width="16" height="11" viewBox="0 0 18 12" aria-hidden="true" className="shrink-0 rounded-[2px]">
      <rect width="18" height="12" fill="#006a4e" />
      <circle cx="8" cy="6" r="3.2" fill="#f42a41" />
    </svg>
  )
}

interface PhoneFieldProps {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
  inputRef?: React.Ref<HTMLInputElement>
}

export function PhoneField({ id, label, value, error, onChange, onBlur, name, inputRef }: PhoneFieldProps) {
  const hasDigits = value.length > 0
  const valid = value.length === LOCAL_DIGITS
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-xs leading-[1.3] font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <div
        className={cn(
          'flex h-12 items-center rounded-[var(--radius-md)] border bg-[var(--surface-2)] pr-1 pl-1',
          'transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-standard)]',
          'focus-within:border-[var(--green-400)] focus-within:shadow-[var(--focus-ring)]',
          valid && !error && 'border-[var(--green-400)]',
          error &&
            'border-[var(--danger)] focus-within:border-[var(--danger)] focus-within:shadow-[0_0_0_3px_var(--danger-soft)]',
          !valid && !error && 'border-[var(--border-default)]',
        )}>
        <span
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-3)] px-2"
          title="Bangladesh — country code is locked">
          <BangladeshMark />
          <span className="text-sm font-medium text-[var(--text-primary)] tabular-nums">{COUNTRY_CODE}</span>
        </span>
        <span className="mx-1.5 h-5 w-px shrink-0 bg-[var(--border-default)]" aria-hidden="true" />
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="1712345678"
          aria-label={`Phone number, country code ${COUNTRY_CODE}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          value={value}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] tabular-nums placeholder:text-[var(--text-muted)] focus:outline-none"
        />
        <div
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden',
            'transition-[width,opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-standard)]',
            hasDigits ? 'w-9 opacity-100' : 'w-0 opacity-0',
          )}
          aria-hidden={!hasDigits}>
          {valid ? (
            <span className="flex h-9 w-9 items-center justify-center text-[var(--green-400)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-standard)]">
              <Check className="h-4 w-4" strokeWidth={1.75} />
            </span>
          ) : (
            <button
              type="button"
              tabIndex={hasDigits ? 0 : -1}
              aria-label="Clear phone number"
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              onClick={() => onChange('')}>
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
      {error && (
        <p id={errorId} className="text-xs leading-[1.45] text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  )
}
