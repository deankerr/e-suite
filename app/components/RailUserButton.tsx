'use client'

import { cn } from '@/lib/utils'
import { SignInButton as ClerkSignInButton, UserButton as ClerkUserButton } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { forwardRef } from 'react'
import { Button } from './ui/Button'
import { Spinner } from './ui/Spinner'

type Props = {}

export const RailUserButton = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function RailUserButton({ className, ...props }, forwardedRef) {
    const { isAuthenticated, isLoading } = useConvexAuth()
    return (
      <div {...props} className={cn('grid place-content-center', className)} ref={forwardedRef}>
        {isLoading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <ClerkUserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                rootBox: { scale: '1.3' },
              },
            }}
          />
        ) : (
          <ClerkSignInButton mode="modal">
            <Button size="1">Log in</Button>
          </ClerkSignInButton>
        )}
      </div>
    )
  },
)
