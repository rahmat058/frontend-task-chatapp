'use client';

import { Spinner } from './Spinner';

/** Shown while the stored JWT is being validated against `GET /auth/me`. */
export function AuthSplash({ label = 'Restoring your session…' }: { label?: string }) {
  return (
    <div
      className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-3 bg-[var(--color-bg)]"
      role="status"
      aria-live="polite"
    >
      <Spinner size="md" className="text-[var(--color-primary)]" />
      <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
    </div>
  );
}
