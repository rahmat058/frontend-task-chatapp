'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Phone, User } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { systemApi } from '@/lib/api/system';

const COUNTRY_CODE = '+880';
const LOCAL_DIGITS = 10;

function toLocalDigits(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('880')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, LOCAL_DIGITS);
}

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [phoneDigits, setPhoneDigits] = useState('');
  const [name, setName] = useState('');
  const [touched, setTouched] = useState({ phone: false, name: false });
  const [apiDown, setApiDown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    systemApi
      .health()
      .then((res) => {
        if (!cancelled) setApiDown(res.status !== 'ok');
      })
      .catch(() => {
        if (!cancelled) setApiDown(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const validatePhone = (digits: string) => {
    if (!digits) return 'Phone number is required';
    if (digits.length !== LOCAL_DIGITS) {
      return `Enter a ${LOCAL_DIGITS}-digit number after ${COUNTRY_CODE}`;
    }
    return undefined;
  };

  const phoneError = touched.phone ? validatePhone(phoneDigits) : undefined;
  const nameError =
    touched.name && !name.trim() ? 'Name is required' : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, name: true });
    if (validatePhone(phoneDigits) || !name.trim()) return;
    await login(`${COUNTRY_CODE}${phoneDigits}`, name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full" noValidate>
      <Input
        id="login-phone"
        label="Phone number"
        type="tel"
        inputMode="numeric"
        placeholder="1712345678"
        value={phoneDigits}
        onChange={(e) => setPhoneDigits(toLocalDigits(e.target.value))}
        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
        error={phoneError}
        autoComplete="tel-national"
        leftIcon={<Phone className="w-4 h-4" />}
        prefix={COUNTRY_CODE}
        aria-label={`Phone number, country code ${COUNTRY_CODE}`}
      />

      <Input
        id="login-name"
        label="Your name"
        type="text"
        placeholder="Ada Lovelace"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        error={nameError}
        autoComplete="name"
        leftIcon={<User className="w-4 h-4" />}
      />

      {apiDown && (
        <div
          className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3"
          role="status"
        >
          The chat API is not reachable right now. Check your connection and try
          again.
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
        New here? Just enter your phone — we&apos;ll create your account
        automatically.
      </p>
    </form>
  );
}
