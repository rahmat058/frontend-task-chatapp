'use client'

import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/users'
import { useAuthStore } from '@/lib/store/authStore'

export function useUserSearch(query: string) {
  const searchTerm = query.trim()
  const currentUserId = useAuthStore((s) => s.user?._id)

  const result = useQuery({
    queryKey: ['users', 'search', searchTerm],
    queryFn: ({ signal }) => usersApi.search(searchTerm, signal),
    enabled: searchTerm.length > 0,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: (previous) => previous,
  })

  const users =
    searchTerm.length > 0 ? result.data?.filter((user) => !currentUserId || user._id !== currentUserId) : undefined

  return {
    ...result,
    data: users,
    isSearching: searchTerm.length > 0 && result.isFetching,
  }
}
