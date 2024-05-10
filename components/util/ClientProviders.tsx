'use client'

import { useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { Provider as Jotai } from 'jotai'
import dynamic from 'next/dynamic'

import { environment } from '@/lib/utils'

const JotaiDevTools = dynamic(() => import('./JotaiDevTools'), { ssr: false })

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Jotai>
        {environment === 'dev' && <JotaiDevTools />}
        {children}
      </Jotai>
    </ConvexProviderWithClerk>
  )
}
