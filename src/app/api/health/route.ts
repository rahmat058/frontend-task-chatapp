import { API_ORIGIN } from '@/lib/api/client'

/**
 * Browser calls to the live `/health` URL are often blocked by CORS even
 * when `/api` auth and chat work. This route checks health server-side.
 */
export async function GET() {
  try {
    const res = await fetch(`${API_ORIGIN}/health`, { cache: 'no-store' })
    const data = (await res.json().catch(() => null)) as { status?: string } | null
    const status = typeof data?.status === 'string' ? data.status : res.ok ? 'ok' : 'down'

    return Response.json(
      { status },
      { status: status === 'ok' ? 200 : 503 },
    )
  } catch {
    return Response.json({ status: 'down' }, { status: 503 })
  }
}
