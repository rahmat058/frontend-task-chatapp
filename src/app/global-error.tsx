'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { Inter } from 'next/font/google'
import { RotateCw, ServerCrash } from 'lucide-react'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

/**
 * Last-resort boundary for errors thrown by the root layout itself. It
 * replaces that layout, so it must render its own document, styles and font,
 * and cannot rely on any provider from the normal tree.
 *
 * `metadata` is unavailable in a Client Component, hence the React `<title>`.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <title>Something went wrong — ChatApp</title>
        <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
          <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <ServerCrash className="h-7 w-7" aria-hidden="true" />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">The app failed to start</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                An unexpected error broke the page before it could load.
              </p>
              {error.digest && (
                <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">Reference: {error.digest}</p>
              )}
            </div>

            <button
              onClick={() => retry()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-6 text-base font-medium text-white transition-colors duration-150 hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Reload the app
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
