/**
 * Gets the user ID from UserProvider context.
 * Must be used within a UserProvider. Throws error if used outside.
 * 
 * Use when: Component is inside UserProvider (most app components).
 * Preferred over useUser() for better performance - no extra React Query subscription.
 */
import { useContext } from 'react';
import { UserContext } from '@/components/shared/user-provider';
import { ChatSDKError } from '@/lib/errors';

export function useUserId() {
  const context = useContext(UserContext);
  if (!context) {
    throw new ChatSDKError('bad_request:auth', 'useUserId must be used within a UserProvider');
  }
  return context;
}