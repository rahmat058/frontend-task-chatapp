import type { MouseEvent } from 'react'

export function scrollToHash(event: MouseEvent<HTMLAnchorElement>, hash: string, onDone?: () => void) {
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  const section = document.getElementById(id)
  if (!section) return

  event.preventDefault()
  onDone?.()

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}
