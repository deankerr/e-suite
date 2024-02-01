'use client'

import { cn } from '@/lib/utils'
import { SignInButton as ClerkSignInButton, UserButton as ClerkUserButton } from '@clerk/nextjs'
import { Button, Card, Heading } from '@radix-ui/themes'
import { useConvexAuth } from 'convex/react'
import { forwardRef } from 'react'
import { GenerationForm } from '../section/GenerationForm'
import { Spinner } from '../ui/Spinner'
import { TheSun } from '../ui/TheSun'
import { UserButton } from '../ui/UserButton'

type Props = {}

export const GenerationPageMenu = forwardRef<
  HTMLDivElement,
  Props & React.ComponentProps<typeof Card>
>(function GenerationPageMenu({ className, ...props }, forwardedRef) {
  const { isAuthenticated, isLoading } = useConvexAuth()

  return (
    <Card
      {...props}
      className={cn(
        'h-fit w-96 max-w-[100vw] shrink-0 place-self-center bg-panel-solid md:inset-4 md:place-self-start',
        className,
      )}
      ref={forwardedRef}
    >
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
      <Heading size="3">Generate</Heading>
      <GenerationForm className="flex flex-col gap-2 pt-1" />
    </Card>
  )
})
