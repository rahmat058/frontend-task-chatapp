import { apiClient } from './client';
import type { SearchUsersResponse } from '@/types/api';

export const usersApi = {
  async search(q: string): Promise<SearchUsersResponse> {
    const res = await apiClient.get<SearchUsersResponse>('/users/search', {
      params: { q },
    });
    return res.data;
  },
};
