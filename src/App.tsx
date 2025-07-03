/**
 * Main Layout Component
 */

import { Base } from '@/components/home/base'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Base />
    </QueryClientProvider>
  )
}

export default App
