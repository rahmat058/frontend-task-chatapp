import axios from 'axios';
import { storage } from '@/lib/utils/storage';
import { useAuthStore } from '@/lib/store/authStore';

export const API_ORIGIN =
  process.env.NEXT_PUBLIC_CHAT_API_ORIGIN ??
  'https://frontend-task-chatapp.onrender.com';

export const apiClient = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clearing auth flips the store to `unauthenticated`, which lets the
      // route guards navigate. A hard location change here would instead
      // reload the app and fight React Router state.
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);
