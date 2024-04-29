'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useKeyStroke } from '@react-hooks-library/core'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { Provider as Jotai } from 'jotai'
import { Leva, useControls } from 'leva'

import { environment } from '@/lib/utils'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [hideLeva, setHideLeva] = useState(environment === 'prod')
  useKeyStroke(['K'], (e) => {
    if (e.ctrlKey) setHideLeva(!hideLeva)
  })

  useControls({ environment: { value: environment, editable: false, order: -1 } })
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Jotai>
        {children}
        <Leva
          collapsed
          hidden={hideLeva}
          titleBar={{
            position: { x: 0, y: 48 },
          }}
        />
      </Jotai>
    </ConvexProviderWithClerk>
  )
}
