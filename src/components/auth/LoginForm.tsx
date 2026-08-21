'use client';

import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/lib/hooks/useAuth';

// Default demo credentials — feel free to change these
const DEFAULT_PHONE = '+8801712345678';
const DEFAULT_NAME = 'Rahmat';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [name, setName] = useState(DEFAULT_NAME);
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
      {/* Demo credentials hint */}
      <div className="flex items-start gap-3 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-3 text-xs text-violet-300">
        <svg className="mt-0.5 w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd"/>
        </svg>
        <span>
          Default credentials are pre-filled.
          Phone: <span className="font-mono font-semibold text-violet-200">{DEFAULT_PHONE}</span>
          {' · '}Name: <span className="font-mono font-semibold text-violet-200">{DEFAULT_NAME}</span>
        </span>
      </div>

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
