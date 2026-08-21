import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * Root page — redirect to /chat if authenticated, else /login.
 * Token check is a lightweight hint; the AuthProvider handles full restore.
 */
export default async function RootPage() {
  // We can't check localStorage from the server, so we just redirect to /chat.
  // AuthProvider + middleware (if added) will handle the final auth gate.
  redirect('/chat');
}
