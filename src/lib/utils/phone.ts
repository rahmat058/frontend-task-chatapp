export const COUNTRY_CODE = '+880'
export const LOCAL_DIGITS = 10

export function toLocalDigits(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('880')) digits = digits.slice(3)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits.slice(0, LOCAL_DIGITS)
}

export function toE164(localDigits: string): string {
  return `${COUNTRY_CODE}${localDigits}`
}
