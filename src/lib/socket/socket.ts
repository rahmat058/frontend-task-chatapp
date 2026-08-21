import { io, type Socket } from 'socket.io-client';
import { storage } from '@/lib/utils/storage';
import { API_ORIGIN } from '@/lib/api/client';

export interface SocketSnapshot {
  socket: Socket | null;
  isConnected: boolean;
}

const DISCONNECTED: SocketSnapshot = { socket: null, isConnected: false };

/**
 * The socket is an external system with its own lifecycle, so it is exposed
 * as a subscribable store and read through `useSyncExternalStore` rather than
 * mirrored into component state.
 */
let snapshot: SocketSnapshot = DISCONNECTED;
const listeners = new Set<() => void>();

function publish(next: SocketSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeToSocket(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSocketSnapshot(): SocketSnapshot {
  return snapshot;
}

export function getServerSocketSnapshot(): SocketSnapshot {
  return DISCONNECTED;
}

/** Socket.io is served from the host root, not the `/api` REST base. */
export function connectSocket(): Socket {
  if (snapshot.socket) return snapshot.socket;

  const socket = io(API_ORIGIN, {
    auth: { token: storage.getToken() },
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => publish({ socket, isConnected: true }));
  socket.on('disconnect', () => publish({ socket, isConnected: false }));

  publish({ socket, isConnected: socket.connected });
  return socket;
}

export function disconnectSocket(): void {
  const current = snapshot.socket;
  if (!current) return;
  current.removeAllListeners();
  current.disconnect();
  publish(DISCONNECTED);
}
