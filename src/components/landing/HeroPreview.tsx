'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { LiveDot } from './HeroMicro'

const STEPS = ['Composing layout', 'Rendering inbox', 'Syncing thread']

export function HeroPreview() {
  const rootRef = useRef<HTMLElement>(null)
  const [reduced, setReduced] = useState(false)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(motion.matches)
    if (motion.matches) {
      setProgress(100)
      setReady(true)
      return
    }

    const started = performance.now()
    const duration = 2200
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration)
      const eased = 1 - (1 - t) ** 3
      setProgress(Math.round(eased * 100))
      if (t < 1) frame = requestAnimationFrame(tick)
      else setReady(true)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const stepIndex = progress < 34 ? 0 : progress < 72 ? 1 : 2
  const animate = visible && !reduced

  return (
    <figure ref={rootRef} className="relative z-10 mx-auto max-w-[1040px]">
      <div className="overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-1)] shadow-[var(--shadow-dialog)]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <LiveDot active={ready && animate} />
            <p className="truncate text-xs text-[var(--text-secondary)]">
              {ready ? 'Preview ready' : STEPS[stepIndex]}
            </p>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)] tabular-nums">{progress}%</p>
        </div>

        <div className="relative">
          <Image
            src="/hero-illustration.png"
            alt="ChatApp product preview: inbox, conversation list, and an active group thread."
            width={786}
            height={513}
            priority
            sizes="(max-width: 1200px) 100vw, 1040px"
            className="h-auto w-full"
            style={{
              clipPath: reduced ? undefined : `inset(0 0 ${Math.max(0, 100 - progress)}% 0)`,
              transition: reduced ? undefined : 'clip-path 80ms linear',
            }}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[var(--surface-3)]">
            <div
              className="h-full bg-[var(--green-500)] transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs leading-[1.45] text-[var(--text-muted)]">
        Authored product preview — visualized like a generate pass, not a live session.
      </figcaption>
    </figure>
  )
}
