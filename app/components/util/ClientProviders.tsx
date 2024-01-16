'use client'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ThemeProvider } from 'next-themes'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </ConvexProvider>
  )
}
