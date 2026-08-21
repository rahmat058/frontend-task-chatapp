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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        {/*
          THESIS: Split-offer landing — copy left, product preview right; not a centered stacked hero.
          OWN-WORLD: Graphite canvas, emerald only for action and presence; Geist; 8px controls; 1px borders; no glass.
          STORY: Visitor sees the messenger, believes DMs and groups stay in sync, opens /login.
          FIRST VIEWPORT: 64px nav; 42/58 hero; primary CTA in the copy column; framed product PNG.
          FORM: Pinned Graphite Emerald from design-style.md and supplied comps. Seed: user-pinned.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
        */}
        <QueryProvider>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
