import axios from 'axios'

/**
 * Same-origin proxy to the assignment `GET /health` (host root, not `/api`).
 * Calling the remote URL from the browser is blocked by CORS, which made
 * the login screen claim the API was down while login and chat still worked.
 */
export const systemApi = {
  async health(): Promise<{ status: 'ok' | 'down' | string }> {
    const res = await axios.get<{ status?: string }>('/api/health', {
      timeout: 8000,
      validateStatus: () => true,
    })
    const status = res.data?.status === 'ok' ? 'ok' : 'down'
    return { status }
  },
}
