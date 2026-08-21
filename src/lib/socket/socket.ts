import { io, Socket } from 'socket.io-client';
import { storage } from '@/lib/utils/storage';

const SOCKET_URL = 'https://frontend-task-chatapp.onrender.com';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(): Socket {
  if (socket?.connected) return socket;

  const token = storage.getToken();

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket', 'polling'],
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
