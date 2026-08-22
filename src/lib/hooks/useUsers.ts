'use client'

import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/users'
import { useAuthStore } from '@/lib/store/authStore'
import { idsMatch } from '@/lib/utils/ids'

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

  const hits = searchTerm.length > 0 ? (result.data ?? []) : undefined
  const users = hits?.filter((user) => !idsMatch(user._id, currentUserId))
  const matchedSelf = Boolean(hits?.some((user) => idsMatch(user._id, currentUserId)))

  return {
    ...result,
    data: users,
    matchedSelf,
    isSearching: searchTerm.length > 0 && result.isFetching,
  }
}
