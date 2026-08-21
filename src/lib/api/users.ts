import { apiClient } from './client';
import { unwrapArray } from './normalize';
import type { SearchUsersResponse } from '@/types/api';
import type { User } from '@/types/models';

export const usersApi = {
  async search(q: string): Promise<SearchUsersResponse> {
    const res = await apiClient.get<unknown>('/users/search', { params: { q } });
    return unwrapArray<User>(res.data);
  },
};
