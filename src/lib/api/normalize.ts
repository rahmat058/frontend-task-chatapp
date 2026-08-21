/**
 * The published OpenAPI spec documents requests only — response bodies and
 * status codes are explicitly left unspecified. These helpers accept both a
 * bare payload and the common `{ data }` / `{ <resource> }` envelopes so a
 * shape change cannot crash a screen.
 */

export function unwrapObject<T>(raw: unknown, key: string): T | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const nested = obj[key] ?? obj.data;
  if (nested && typeof nested === 'object') return nested as T;
  return obj as T;
}

export function unwrapArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (!raw || typeof raw !== 'object') return [];

  const obj = raw as Record<string, unknown>;
  const arrayKey = Object.keys(obj).find((k) => Array.isArray(obj[k]));
  return arrayKey ? (obj[arrayKey] as T[]) : [];
}

/** Extracts a human-readable message from the API's error envelope. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const data = (
    error as { response?: { data?: unknown } } | undefined
  )?.response?.data;

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const nested = obj.error;
    if (nested && typeof nested === 'object') {
      const message = (nested as Record<string, unknown>).message;
      if (typeof message === 'string' && message) return message;
    }
    for (const key of ['message', 'error'] as const) {
      const value = obj[key];
      if (typeof value === 'string' && value) return value;
    }
  }

  return fallback;
}
