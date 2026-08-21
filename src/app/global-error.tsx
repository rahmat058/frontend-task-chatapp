'use client'

import { useEffect } from 'react'
import { Geist, Inter } from 'next/font/google'
import { RotateCw, ServerCrash } from 'lucide-react'
import './globals.css'

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

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className={`${geist.variable} ${inter.variable}`}>
      <body className={geist.className}>
        <title>Something went wrong — ChatApp</title>
        <main className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] px-4 py-12">
          <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--danger-soft)] text-[var(--danger)]">
              <ServerCrash className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-[22px] font-semibold text-[var(--text-primary)]">The app failed to start</h1>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                An unexpected error broke the page before it could load.
              </p>
              {error.digest && (
                <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">Reference: {error.digest}</p>
              )}
            </div>

            <button
              onClick={() => retry()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--green-600)] px-5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--green-500)]">
              <RotateCw className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Reload the app
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
