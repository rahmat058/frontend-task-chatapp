import { apiClient } from './client'
import { unwrapArray } from './normalize'
import { getEntityId } from '@/lib/utils/ids'
import { useUserDirectory } from '@/lib/store/userDirectory'
import type { SearchUsersResponse } from '@/types/api'
import type { User } from '@/types/models'

export const usersApi = {
  async search(q: string): Promise<SearchUsersResponse> {
    const res = await apiClient.get<unknown>('/users/search', { params: { q } })
    const users = unwrapArray<User>(res.data)
      .map((user) => {
        const _id = getEntityId(user)
        if (!_id) return null
        return { ...user, _id }
      })
      .filter((user): user is User => user !== null)

    useUserDirectory.getState().remember(users)
    return users
  },
}
