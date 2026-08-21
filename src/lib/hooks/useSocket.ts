'use client'

import { useSyncExternalStore } from 'react'
import { getServerSocketSnapshot, getSocketSnapshot, subscribeToSocket, type SocketSnapshot } from '@/lib/socket/socket'

export function useSocket(): SocketSnapshot {
  return useSyncExternalStore(subscribeToSocket, getSocketSnapshot, getServerSocketSnapshot)
}
