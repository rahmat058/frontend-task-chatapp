'use client'

import { useEffect, useState } from 'react'

export const SEARCH_DEBOUNCE_MS = 600

export function useDebounce<T>(value: T, delay: number = SEARCH_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
