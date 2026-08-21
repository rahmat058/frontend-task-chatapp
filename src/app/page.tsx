import { LandingPage } from '@/components/landing/LandingPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ChatApp — Conversation, without the noise',
  description: 'Private messages and groups that stay in sync — instantly. Sign in with your phone and start a thread.',
}

export default function HomePage() {
  return <LandingPage />
}
