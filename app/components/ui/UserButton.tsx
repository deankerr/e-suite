'use client'

import { cn } from '@/lib/utils'
import { SignInButton as ClerkSignInButton, UserButton as ClerkUserButton } from '@clerk/nextjs'
import { Button } from '@radix-ui/themes'
import { useConvexAuth } from 'convex/react'
import { forwardRef } from 'react'
import { Spinner } from '../ui/Spinner'

type Props = {}

export const UserButton = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function UserButton({ className, ...props }, forwardedRef) {
    const { isAuthenticated, isLoading } = useConvexAuth()
    // const userPanelOpen = true

    return (
      <div
        {...props}
        className={cn('grid size-16 place-content-center', className)}
        ref={forwardedRef}
      >
        {isLoading ? (
          <Spinner className="opacity-50" />
        ) : isAuthenticated ? (
          <ClerkUserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: { width: '2.8rem', height: '2.8rem' } } }}
          />
        ) : (
          <ClerkSignInButton mode="modal">
            <Button variant="surface" size="3" className="cursor-pointer">
              Sign in
            </Button>
          </ClerkSignInButton>
        )}
      </div>
    )
  },
)
