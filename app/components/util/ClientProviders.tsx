'use client'

import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ThemeProvider } from 'next-themes'
import { Suspense } from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WrappedClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </WrappedClerkProvider>
  )
}

function WrappedClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        appearance={{ baseTheme: dark }}
      >
        {children}
      </ClerkProvider>
    </Suspense>
  )
}
