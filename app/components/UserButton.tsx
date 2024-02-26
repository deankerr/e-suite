'use client'

import { cn } from '@/lib/utils'
import { SignInButton as ClerkSignInButton, UserButton as ClerkUserButton } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { Button } from './ui/Button'
import { Spinner } from './ui/Spinner'

type Props = {}

export const RailUserButton = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function RailUserButton({ className, ...props }, forwardedRef) {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const pathname = usePathname()
    return (
      <div {...props} className={cn('grid place-content-center', className)} ref={forwardedRef}>
        {isLoading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <ClerkUserButton afterSignOutUrl={'/'} />
        ) : (
          <ClerkSignInButton mode="modal" redirectUrl={pathname}>
            <Button size="1" className="h-fit text-center">
              <div className="h-full py-2">Log in</div>
            </Button>
          </ClerkSignInButton>
        )}
      </div>
    )
  },
)
