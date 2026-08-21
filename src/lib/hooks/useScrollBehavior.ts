'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const BOTTOM_THRESHOLD = 100; // px from bottom to be considered "at bottom"

export function useScrollBehavior(deps: unknown[]) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // Track scroll position
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distFromBottom <= BOTTOM_THRESHOLD;
    setIsAtBottom(atBottom);
    setShowScrollButton(!atBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Auto-scroll when new messages come in — only if at bottom
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom('smooth');
    }
  }, deps);

  // Initial scroll to bottom (instant)
  useEffect(() => {
    scrollToBottom('instant');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scrollRef, isAtBottom, showScrollButton, scrollToBottom };
}
