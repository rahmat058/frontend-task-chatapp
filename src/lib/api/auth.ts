import { apiClient } from './client';
import type { LoginRequest, LoginResponse } from '@/types/api';
import type { User } from '@/types/models';

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/auth/login', data);
    return res.data;
  },

  async me(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
};
