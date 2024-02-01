'use client'

import { cn } from '@/lib/utils'
import { SignInButton as ClerkSignInButton, UserButton as ClerkUserButton } from '@clerk/nextjs'
import { Button } from '@radix-ui/themes'
import { useConvexAuth } from 'convex/react'
import { forwardRef } from 'react'
import { Spinner } from '../ui/Spinner'
import { TheSun } from '../ui/TheSun'

type Props = {}

export const SunLogoUserButton = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function SunLogoUserButton({ className, ...props }, forwardedRef) {
    const { isAuthenticated, isLoading } = useConvexAuth()

    return (
      <div {...props} className={cn('', className)} ref={forwardedRef}>
        <div className="flex items-center justify-between pb-3 pr-3">
          <TheSun />
          <div className="justify-content-center grid h-full grow pl-5 pr-1 pt-2">
            {!isLoading && !isAuthenticated && (
              <ClerkSignInButton mode="modal">
                <Button size="3" variant="surface">
                  Sign in
                </Button>
              </ClerkSignInButton>
            )}

            {!isLoading && isAuthenticated && (
              <div className="justify-self-end">
                <ClerkUserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: { width: '2.8rem', height: '2.8rem' } } }}
                />
              </div>
            )}

            {isLoading && <Spinner className="opacity-50" />}
          </div>
        </div>
      </div>
    )
  },
)
