'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

export function Providers({
  session,
  children,
}: {
  session: Session | null
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 60 } } }),
  )
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
