'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ArrowRight, Lock, Phone, User } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/lib/hooks/useAuth'
import { systemApi } from '@/lib/api/system'
import { COUNTRY_CODE, LOCAL_DIGITS, toE164, toLocalDigits } from '@/lib/utils/phone'

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
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { phoneDigits: '', name: '' },
    mode: 'onBlur',
  })

  useEffect(() => {
    let cancelled = false
    systemApi
      .health()
      .then((res) => {
        if (!cancelled) setApiDown(res.status !== 'ok')
      })
      .catch(() => {
        // Probe failed locally (dev proxy, etc.). Login errors still surface
        // a real outage — do not block the form with a false alarm.
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
          <Input
            id="login-phone"
            label="Phone number"
            type="tel"
            inputMode="numeric"
            placeholder="1712345678"
            autoComplete="tel-national"
            leftIcon={<Phone className="h-4 w-4" />}
            prefix={COUNTRY_CODE}
            aria-label={`Phone number, country code ${COUNTRY_CODE}`}
            error={errors.phoneDigits?.message}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(e) => field.onChange(toLocalDigits(e.target.value))}
            name={field.name}
            ref={field.ref}
          />
        )}
      />

      <Input
        id="login-name"
        label="Your name"
        type="text"
        placeholder="Ada Lovelace"
        autoComplete="name"
        leftIcon={<User className="h-4 w-4" />}
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          validate: (value) => value.trim().length > 0 || 'Name is required',
        })}
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
        rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
        className="mt-1 w-full">
        {isLoading ? 'Signing in…' : 'Continue'}
      </Button>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-muted)]">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        New here? We&apos;ll create your account automatically.
      </p>
    </form>
  )
}
