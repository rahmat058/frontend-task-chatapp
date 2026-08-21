import { apiClient } from './client';
import { unwrapObject } from './normalize';
import type { LoginRequest, LoginResponse } from '@/types/api';
import type { User } from '@/types/models';

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post<unknown>('/auth/login', data);
    const body = (unwrapObject<Record<string, unknown>>(res.data, 'data') ??
      {}) as Record<string, unknown>;

    const token = typeof body.token === 'string' ? body.token : '';
    const user = (unwrapObject<User>(body.user ?? body, 'user') ?? null) as User | null;

    if (!token || !user?._id) {
      throw new Error('Login response did not include a token and user.');
    }
    return { token, user };
  },

  async me(): Promise<User> {
    const res = await apiClient.get<unknown>('/auth/me');
    const user = unwrapObject<User>(res.data, 'user');

    if (!user?._id) {
      throw new Error('Could not resolve the current user.');
    }
    return user;
  },
};
