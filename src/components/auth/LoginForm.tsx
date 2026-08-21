'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ArrowRight, Check, ChevronsUpDown, Lock, User, X } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/lib/hooks/useAuth'
import { systemApi } from '@/lib/api/system'
import { COUNTRY_CODE, LOCAL_DIGITS, toE164, toLocalDigits } from '@/lib/utils/phone'

interface LoginValues {
  phoneDigits: string
  name: string
}

function BangladeshMark() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" className="shrink-0 rounded-sm">
      <rect width="18" height="12" fill="#006a4e" />
      <circle cx="8" cy="6" r="3.2" fill="#f42a41" />
    </svg>
  )
}

export function LoginForm() {
  const { login, isLoading, error } = useAuth()
  const [apiDown, setApiDown] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { phoneDigits: '', name: '' },
    mode: 'onBlur',
  })

  const nameValue = watch('name')

  useEffect(() => {
    let cancelled = false
    systemApi
      .health()
      .then((res) => {
        if (!cancelled) setApiDown(res.status !== 'ok')
      })
      .catch(() => {
        if (!cancelled) setApiDown(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const onSubmit = async ({ phoneDigits, name }: LoginValues) => {
    const ok = await login(toE164(phoneDigits), name.trim())
    if (ok) reset({ phoneDigits: '', name: '' })
  }

  const nameField = register('name', {
    required: 'Name is required',
    validate: (value) => value.trim().length > 0 || 'Name is required',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5" noValidate>
      <Controller
        name="phoneDigits"
        control={control}
        rules={{
          required: 'Phone number is required',
          validate: (value) =>
            value.length === LOCAL_DIGITS || `Enter a ${LOCAL_DIGITS}-digit number after ${COUNTRY_CODE}`,
        }}
        render={({ field }) => {
          const valid = field.value.length === LOCAL_DIGITS
          return (
            <Input
              id="login-phone"
              label="Phone number"
              type="tel"
              inputMode="numeric"
              placeholder="1712345678"
              autoComplete="tel-national"
              aria-label={`Phone number, country code ${COUNTRY_CODE}`}
              error={errors.phoneDigits?.message}
              valid={valid}
              leading={
                <span
                  className="flex h-9 items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--surface-3)] px-2 text-xs font-medium text-[var(--text-secondary)]"
                  title="Bangladesh">
                  <BangladeshMark />
                  <ChevronsUpDown className="h-3 w-3 opacity-50" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-[var(--text-primary)]">{COUNTRY_CODE}</span>
                </span>
              }
              className="h-12"
              rightIcon={
                valid ? (
                  <Check className="h-4 w-4 text-[var(--green-400)]" strokeWidth={1.75} aria-hidden="true" />
                ) : undefined
              }
              value={field.value}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(toLocalDigits(e.target.value))}
              name={field.name}
              ref={field.ref}
            />
          )
        }}
      />

      <Input
        id="login-name"
        label="Your name"
        type="text"
        placeholder="Ada Lovelace"
        autoComplete="name"
        leftIcon={<User className="h-4 w-4" strokeWidth={1.75} />}
        className="h-12"
        error={errors.name?.message}
        valid={Boolean(nameValue?.trim()) && !errors.name}
        rightIcon={
          nameValue ? (
            <button
              type="button"
              aria-label="Clear name"
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] hover:text-[var(--text-primary)]"
              onClick={() => setValue('name', '', { shouldValidate: true })}>
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          ) : undefined
        }
        {...nameField}
      />

      {apiDown && (
        <div
          className="rounded-[var(--radius-md)] border border-[var(--warning)]/30 bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-[var(--warning)]"
          role="status">
          The chat API is not reachable right now. Check your connection and try again.
        </div>
      )}

      {error && (
        <div
          className="animate-fade-in rounded-[var(--radius-md)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
          role="alert">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
        rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" strokeWidth={1.75} /> : undefined}
        className="mt-1 w-full">
        {isLoading ? 'Signing in…' : 'Continue'}
      </Button>

      <p className="flex items-center justify-center gap-2 text-center text-xs leading-relaxed text-[var(--text-muted)]">
        <Lock className="h-3.5 w-3.5 shrink-0 text-[var(--green-400)]" strokeWidth={1.75} aria-hidden="true" />
        New here? We&apos;ll create your account automatically.
      </p>
    </form>
  )
}
