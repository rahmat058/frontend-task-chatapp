'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/auth';
import { storage } from '@/lib/utils/storage';

/**
 * Restores an existing session on mount by validating the stored JWT against
 * `GET /auth/me`, then moves auth out of the `restoring` state so route
 * guards can act.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    const token = storage.getToken();
    if (!token) {
      clearAuth();
      return;
    }

    authApi
      .me()
      .then((user) => setAuth(user, token))
      .catch(() => clearAuth());
  }, [setAuth, clearAuth]);

  return <>{children}</>;
}
