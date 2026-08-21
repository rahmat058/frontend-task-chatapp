import { create } from 'zustand'
import type { User } from '@/types/models'
import { storage } from '@/lib/utils/storage'
import { useUserDirectory } from '@/lib/store/userDirectory'

/**
 * `restoring` is the initial state on every load: the JWT lives in
 * localStorage, so nothing can be decided until AuthProvider has called
 * `GET /auth/me`. Route guards must wait for this to resolve, otherwise a
 * valid session gets bounced to the login screen.
 */
export type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  token: string | null
  status: AuthStatus
  isAuthenticated: boolean

  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  status: 'restoring',
  isAuthenticated: false,

  setAuth: (user, token) => {
    storage.setToken(token)
    useUserDirectory.getState().remember([user])
    set({ user, token, status: 'authenticated', isAuthenticated: true })
  },

  clearAuth: () => {
    storage.removeToken()
    set({
      user: null,
      token: null,
      status: 'unauthenticated',
      isAuthenticated: false,
    })
  },
}))
