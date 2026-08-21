'use client';

import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/lib/hooks/useAuth';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [touched, setTouched] = useState({ phone: false, name: false });

  const phoneError =
    touched.phone && phone.trim().length === 0 ? 'Phone number is required' : undefined;
  const nameError =
    touched.name && name.trim().length === 0 ? 'Name is required' : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, name: true });
    if (!phone.trim() || !name.trim()) return;
    await login(phone.trim(), name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full" noValidate>
      <Input
        id="login-phone"
        label="Phone number"
        type="tel"
        placeholder="+1 555 123 4567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
        error={phoneError}
        autoComplete="tel"
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        }
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
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        }
      />

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
        className="w-full mt-1"
      >
        {isLoading ? 'Signing in...' : 'Continue →'}
      </Button>

      <p className="text-center text-xs text-[var(--color-text-muted)] leading-relaxed">
        New to ChatApp? Just enter your phone — we&apos;ll create your account automatically.
      </p>
    </form>
  );
}
