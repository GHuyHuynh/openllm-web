/**
 * Main Layout Component
 */

import { Toaster } from 'sonner';
import { Base } from '@/pages/home/base'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { UserProvider } from './components/shared/user-provider';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const queryClient = new QueryClient();

function AppContent() {
  return (
    <>
      {/* Toaster */}
      <Toaster position="top-center" />

      {/* Browser Router */}
      <BrowserRouter>
        <Base />
      </BrowserRouter>

      {/* React Query Devtools */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {/* TODO: Add error boundary and loading screen */}
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <UserProvider>
              <AppContent />
            </UserProvider>
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
