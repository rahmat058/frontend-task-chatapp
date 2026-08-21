import axios from 'axios';
import { API_ORIGIN } from './client';

/** Served at the host root, not under `/api`. */
export const systemApi = {
  async health(): Promise<{ status: string }> {
    const res = await axios.get<{ status?: string }>(`${API_ORIGIN}/health`, {
      timeout: 8000,
    });
    const status =
      typeof res.data?.status === 'string' ? res.data.status : 'ok';
    return { status };
  },
};
