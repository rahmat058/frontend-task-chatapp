'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

export function LiveDot({ active }: { active: boolean }) {
  const reduce = usePrefersReducedMotion()

  return (
    <motion.span
      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green-400)]"
      animate={!reduce && active ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
      transition={{ duration: 1.6, repeat: Infinity, ease: [0.2, 0.8, 0.2, 1] }}
    />
  )
}
