'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** Distance from the bottom still treated as "following the conversation". */
const BOTTOM_THRESHOLD = 100

/**
 * Auto-scrolls to the newest message only while the user is already at the
 * bottom. If they have scrolled up to read history, incoming messages surface
 * a jump-to-latest affordance instead of yanking the viewport.
 */
export function useScrollBehavior(messageCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isAtBottom = useRef(true)
  const previousCount = useRef(0)
  const hasPerformedInitialScroll = useRef(false)

  const [showScrollButton, setShowScrollButton] = useState(false)
  const [hasNewMessages, setHasNewMessages] = useState(false)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
    isAtBottom.current = true
    setShowScrollButton(false)
    setHasNewMessages(false)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight
      const atBottom = distance <= BOTTOM_THRESHOLD
      isAtBottom.current = atBottom
      setShowScrollButton(!atBottom)
      if (atBottom) setHasNewMessages(false)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const previous = previousCount.current
    previousCount.current = messageCount

    if (messageCount === 0) return

    if (!hasPerformedInitialScroll.current) {
      hasPerformedInitialScroll.current = true
      scrollToBottom('instant')
      return
    }

    // Older pages prepend above the viewport; they must not move the user.
    if (messageCount <= previous) return

    if (isAtBottom.current) {
      scrollToBottom('smooth')
    } else {
      setHasNewMessages(true)
    }
  }, [messageCount, scrollToBottom])

  return { scrollRef, showScrollButton, hasNewMessages, scrollToBottom }
}
