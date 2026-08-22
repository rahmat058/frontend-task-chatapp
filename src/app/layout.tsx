import './globals.css'
import type { Metadata } from 'next'
import { Geist, Inter } from 'next/font/google'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { SocketProvider } from '@/providers/SocketProvider'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ChatApp — Real-time Messaging',
  description: 'Private messages and groups that stay in sync — instantly.',
  icons: {
    icon: [{ url: '/nav-logo.svg', type: 'image/svg+xml' }],
    shortcut: '/nav-logo.svg',
    apple: '/nav-logo.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
