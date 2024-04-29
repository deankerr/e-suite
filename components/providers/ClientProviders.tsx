'use client'

import { useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { Leva } from 'leva'

import { environment } from '@/lib/utils'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  console.log(environment)
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
      <Leva collapsed />
    </ConvexProviderWithClerk>
  )
}
