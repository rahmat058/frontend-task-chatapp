'use client';

import { useState } from 'react';
import { ArrowRight, Phone, User } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/lib/hooks/useAuth';

/** Permissive on formatting, strict on being a usable phone number. */
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [touched, setTouched] = useState({ phone: false, name: false });

  const validatePhone = (value: string) => {
    if (!value.trim()) return 'Phone number is required';
    if (!PHONE_PATTERN.test(value.trim())) return 'Enter a valid phone number';
    return undefined;
  };

  const phoneError = touched.phone ? validatePhone(phone) : undefined;
  const nameError =
    touched.name && !name.trim() ? 'Name is required' : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, name: true });
    if (validatePhone(phone) || !name.trim()) return;
    await login(phone.trim(), name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full" noValidate>
      <Input
        id="login-phone"
        label="Phone number"
        type="tel"
        inputMode="tel"
        placeholder="+1 555 123 4567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
        error={phoneError}
        autoComplete="tel"
        leftIcon={<Phone className="w-4 h-4" />}
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
