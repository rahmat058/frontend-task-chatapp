'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ArrowRight, Lock, User, X } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { PhoneField } from '@/components/auth/PhoneField'
import { useAuth } from '@/lib/hooks/useAuth'
import { systemApi } from '@/lib/api/system'
import { COUNTRY_CODE, LOCAL_DIGITS, toE164, toLocalDigits } from '@/lib/utils/phone'
import { cn } from '@/lib/utils/cn'

interface LoginValues {
  phoneDigits: string
  name: string
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
    mode: 'onChange',
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
        render={({ field }) => (
          <PhoneField
            id="login-phone"
            label="Phone number"
            value={field.value}
            error={errors.phoneDigits?.message}
            onChange={(next) => field.onChange(toLocalDigits(next))}
            onBlur={field.onBlur}
            name={field.name}
            inputRef={field.ref}
          />
        )}
      />

      <Input
        id="login-name"
        label="Your name"
        type="text"
        placeholder="Ada Lovelace"
        autoComplete="name"
        leftIcon={<User className="h-4 w-4" strokeWidth={1.75} />}
        className={cn('h-12', nameValue ? 'pr-11' : 'pr-4')}
        error={errors.name?.message}
        valid={Boolean(nameValue?.trim()) && !errors.name}
        rightIcon={
          <div
            className={cn(
              'flex items-center justify-center overflow-hidden transition-[width,opacity] duration-[var(--duration-base)] ease-[var(--ease-standard)]',
              nameValue ? 'w-8 opacity-100' : 'w-0 opacity-0',
            )}>
            <button
              type="button"
              tabIndex={nameValue ? 0 : -1}
              aria-label="Clear name"
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] hover:text-[var(--text-primary)]"
              onClick={() => setValue('name', '', { shouldValidate: true })}>
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
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
