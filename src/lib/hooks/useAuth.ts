'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

export function useAuth() {
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (phone: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await authApi.login({ phone, name });
      setAuth(user, token);
      router.push('/chat');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  return { login, logout, user, isAuthenticated, isLoading, error };
}
