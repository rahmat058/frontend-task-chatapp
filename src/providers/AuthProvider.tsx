'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/auth';
import { storage } from '@/lib/utils/storage';

/**
 * Restores an existing session on app mount by calling /auth/me
 * with any stored JWT. Clears auth on failure.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore();
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    const token = storage.getToken();
    if (!token) return;

    authApi
      .me()
      .then((user) => {
        setAuth(user, token);
      })
      .catch(() => {
        clearAuth();
      });
  }, [setAuth, clearAuth]);

  return <>{children}</>;
}
