/**
 * Fetches and caches the user ID from IndexedDB.
 * Creates a new user ID if none exists. Uses SWR with Suspense.
 *
 * Use when: Component is outside UserProvider or needs direct database access.
 * Most components should use useUserId() instead for better performance.
 */
import useSWR from 'swr';
import { initializeUser } from '@/services/user-service';

export function useUser() {
  const { data } = useSWR('user', initializeUser, {
    suspense: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false,
    revalidateIfStale: false,
  });

  return data;
}
