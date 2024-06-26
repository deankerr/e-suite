'use client'

import { useAuth } from '@clerk/nextjs'
import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache/provider'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { createStore, Provider as Jotai } from 'jotai'
import dynamic from 'next/dynamic'

import { environment } from '@/lib/utils'

const JotaiDevTools = dynamic(() => import('./JotaiDevTools'), { ssr: false })

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const store = createStore()
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexQueryCacheProvider debug>
        <Jotai store={store}>
          {environment === 'dev' && process.env.NEXT_PUBLIC_JOTAI_DEVTOOLS && (
            <JotaiDevTools theme="dark" store={store} />
          )}
          {children}
        </Jotai>
      </ConvexQueryCacheProvider>
    </ConvexProviderWithClerk>
  )
}
