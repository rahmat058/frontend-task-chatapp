'use client'

import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

function getSnapshot() {
  return navigator.onLine
}

/** Assume online during SSR so the reconnect banner does not flash on hydrate. */
function getServerSnapshot() {
  return true
}

/** Browser network status (`navigator.onLine`), not Socket.io handshake state. */
export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
