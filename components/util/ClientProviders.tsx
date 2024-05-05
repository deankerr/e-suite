'use client'

import { useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { createStore, Provider as Jotai } from 'jotai'
import { DevTools } from 'jotai-devtools'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const customStore = createStore()

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Jotai store={customStore}>
        <DevTools store={customStore} />
        {children}
      </Jotai>
    </ConvexProviderWithClerk>
  )
}
