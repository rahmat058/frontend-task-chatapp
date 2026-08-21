'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ArrowRight, Phone, User } from 'lucide-react'
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
        if (!cancelled) setApiDown(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const onSubmit = async ({ phoneDigits, name }: LoginValues) => {
    await login(toE164(phoneDigits), name.trim())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full" noValidate>
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
            leftIcon={<Phone className="w-4 h-4" />}
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
        leftIcon={<User className="w-4 h-4" />}
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          validate: (value) => value.trim().length > 0 || 'Name is required',
        })}
      />

      {apiDown && (
        <div
          className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3"
          role="status"
        >
          The chat API is not reachable right now. Check your connection and try again.
        </div>
      )}

      {error && (
        <div
          className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in"
          role="alert"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
        rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
        className="w-full mt-1"
      >
        {isLoading ? 'Signing in…' : 'Continue'}
      </Button>

      <p className="text-center text-xs text-[var(--color-text-muted)] leading-relaxed">
        New here? Just enter your phone — we&apos;ll create your account automatically.
      </p>
    </form>
  )
}
