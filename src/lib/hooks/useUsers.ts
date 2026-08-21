'use client'

import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/users'

export function useUserSearch(query: string) {
  const searchTerm = query.trim()

  const result = useQuery({
    queryKey: ['users', 'search', searchTerm],
    queryFn: ({ signal }) => usersApi.search(searchTerm, signal),
    enabled: searchTerm.length > 0,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: (previous) => previous,
  })

  return {
    ...result,
    data: searchTerm.length > 0 ? result.data : undefined,
    isSearching: searchTerm.length > 0 && result.isFetching,
  }
}
