'use client'

import { UserButton as ClerkUserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'

type UserButtonProps = {
  props?: any
}

export const UserButton = ({ props }: UserButtonProps) => {
  const { isLoading, isAuthenticated } = useConvexAuth()
  if (isLoading) return null

  return isAuthenticated ? (
    <ClerkUserButton afterSignOutUrl="/" />
  ) : (
    <>
      <SignInButton mode="modal" /> <SignUpButton mode="modal" />
    </>
  )
}
