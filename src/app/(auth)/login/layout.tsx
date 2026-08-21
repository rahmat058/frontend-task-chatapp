import type { Metadata } from 'next';
import { MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign in — ChatApp',
  description: 'Sign in with your phone number to access your chats.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
      <div className="relative w-full max-w-sm bg-[var(--color-surface-1)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-8 animate-fade-in">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
              Welcome to ChatApp
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Enter your details to continue
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
