import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/models';
import { storage } from '@/lib/utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        storage.setToken(token);
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        storage.removeToken();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'chat-auth',
      // Only persist user (token is in localStorage via storage util)
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
