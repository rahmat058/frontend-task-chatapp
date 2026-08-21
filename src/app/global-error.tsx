'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import { RotateCw, ServerCrash } from 'lucide-react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

/**
 * Last-resort boundary for errors thrown by the root layout itself. It
 * replaces that layout, so it must render its own document, styles and font,
 * and cannot rely on any provider from the normal tree.
 *
 * `metadata` is unavailable in a Client Component, hence the React `<title>`.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <title>Something went wrong — ChatApp</title>
        <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
          <div className="w-full max-w-sm flex flex-col items-center text-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
              <ServerCrash className="w-7 h-7" aria-hidden="true" />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                The app failed to start
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                An unexpected error broke the page before it could load.
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1">
                  Reference: {error.digest}
                </p>
              )}
            </div>

            <button
              onClick={() => retry()}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-base font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              <RotateCw className="w-4 h-4" aria-hidden="true" />
              Reload the app
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
