'use client'

import { Session } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'
import { Button } from './ui/button'

export function SignInOutButton({ session }: { session: Session | null }) {
  return (
    <Button variant="outline" onClick={() => (session ? signOut() : signIn())}>
      {session ? 'sign out' : 'sign in'}
    </Button>
  )
}
