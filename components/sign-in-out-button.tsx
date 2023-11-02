'use client'

import { cn } from '@/lib/utils'
import { Session } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'
import { Button } from './ui/button'

export function SignInOutButton({
  session,
  className,
  ...props
}: { session: Session | null } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn('text-sm', className)}
      onClick={() => (session ? signOut() : signIn())}
    >
      {session ? 'sign out' : 'sign in'}
    </Button>
  )
}
