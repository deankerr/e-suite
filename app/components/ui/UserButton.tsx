'use client'

import { UserButton as ClerkUserButton, SignInButton } from '@clerk/nextjs'
import { Button } from '@radix-ui/themes'
import { useConvexAuth } from 'convex/react'
import { useAtom } from 'jotai'

// import { debugAuthStateUiAtom } from '../atoms'

type UserButtonProps = {
  props?: any
}

export const UserButton = ({ props }: UserButtonProps) => {
  const { isLoading, isAuthenticated } = useConvexAuth()
  if (isLoading) return null

  return isAuthenticated ? (
    <ClerkUserButton
      afterSignOutUrl="/"
      appearance={{ elements: { avatarBox: { width: '2.5rem', height: '2.5rem' } } }}
    />
  ) : (
    <SignInButton mode="modal">
      <Button variant="surface" color="orange" className="-mx-2">
        Sign in
      </Button>
    </SignInButton>
  )
}
