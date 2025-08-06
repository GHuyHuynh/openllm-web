/**
 * Fetches and caches the user ID from IndexedDB.
 * Creates a new user ID if none exists. Uses React Query with Suspense.
 * 
 * Use when: Component is outside UserProvider or needs direct database access.
 * Most components should use useUserId() instead for better performance.
 */
import { useSuspenseQuery } from '@tanstack/react-query';
import { initializeUser } from '@/services/user-service';

export function useUser() {
  const { data } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: initializeUser,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  
  return data;
}