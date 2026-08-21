'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { useDeferredValue } from 'react';

export function useUserSearch(query: string) {
  const deferredQuery = useDeferredValue(query);

  return useQuery({
    queryKey: ['users', 'search', deferredQuery],
    queryFn: () => usersApi.search(deferredQuery),
    enabled: deferredQuery.trim().length > 0,
    staleTime: 5_000,
    placeholderData: (prev) => prev, // keep previous results while typing
  });
}
