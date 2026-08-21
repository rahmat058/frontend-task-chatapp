/**
 * Mongo / REST payloads mix strings, `{ _id }`, `{ id }`, and nested refs.
 * Always compare the extracted string so "mine vs theirs" cannot flip after
 * a socket echo or a history refetch.
 */
export function getEntityId(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('_id' in obj || 'id' in obj) {
      return getEntityId(obj._id ?? obj.id);
    }
    if (typeof obj.toString === 'function' && obj.toString !== Object.prototype.toString) {
      const asString = obj.toString();
      if (asString && asString !== '[object Object]') return asString;
    }
  }
  return undefined;
}

export function idsMatch(a: unknown, b: unknown): boolean {
  const left = getEntityId(a);
  const right = getEntityId(b);
  return Boolean(left && right && left === right);
}
