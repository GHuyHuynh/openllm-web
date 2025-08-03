/**
 * Main Layout Component
 */

import { Toaster } from 'sonner';
import { Base } from '@/pages/home/base'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@/components/ui/theme-provider'

const queryClient = new QueryClient();

function App() {

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {/* Toaster */}
        <Toaster position="top-center" />

        {/* Browser Router */}
        <BrowserRouter>
          <Base />
        </BrowserRouter>

        {/* React Query Devtools */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
