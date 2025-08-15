/**
 * Main Layout Component
 */

import { Toaster } from 'sonner';
import { HomePage } from '@/pages/home/home-page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { UserProvider } from '@/components/core/user-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AppSidebar } from '@/components/core/app-sidebar';
import { BASE_URL } from '@/constants/constants';
import { DataStreamProvider } from '@/components/core/data-stream-provider';

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <UserProvider>
              <SidebarProvider defaultOpen={false}>
                <BrowserRouter basename={BASE_URL}>
                  <DataStreamProvider>
                    {children}
                  </DataStreamProvider>
                </BrowserRouter>
              </SidebarProvider>
            </UserProvider>
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  return (
    <>
      {/* Toaster */}
      <Toaster position="top-center" />

      {/* Main Content */}
      <HomePage />

      {/* React Query Devtools */}
      {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
    </>
  )
}

function App() {
  return (
    <Providers>
      <AppSidebar />
      <SidebarInset>
        <AppContent />
      </SidebarInset>
    </Providers>
  )
}

export default App
