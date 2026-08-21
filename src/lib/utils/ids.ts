/**
 * Mongo / REST payloads mix strings, `{ _id }`, `{ id }`, `{ $oid }`, and
 * nested `{ user }` / `{ userId }` refs.
 */
export function getEntityId(value: unknown): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.$oid === 'string' && obj.$oid) return obj.$oid
    if ('_id' in obj || 'id' in obj) {
      const nested = getEntityId(obj._id ?? obj.id)
      if (nested) return nested
    }
    if ('userId' in obj) {
      const nested = getEntityId(obj.userId)
      if (nested) return nested
    }
    if ('user' in obj) {
      const nested = getEntityId(obj.user)
      if (nested) return nested
    }
    if (typeof obj.toString === 'function' && obj.toString !== Object.prototype.toString) {
      const asString = obj.toString()
      if (asString && asString !== '[object Object]') return asString
    }
  }
  return undefined
}

export function idsMatch(a: unknown, b: unknown): boolean {
  const left = getEntityId(a)
  const right = getEntityId(b)
  return Boolean(left && right && left === right)
}
