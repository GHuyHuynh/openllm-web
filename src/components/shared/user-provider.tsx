import { createContext, type ReactNode } from 'react';
import { useUser } from '@/hooks/use-user';

export const UserContext = createContext<string>('');

export function UserProvider({ children }: { children: ReactNode }) {
  const userId = useUser();
  
  return (
    <UserContext.Provider value={userId}>
      {children}
    </UserContext.Provider>
  );
}
