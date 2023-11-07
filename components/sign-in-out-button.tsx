'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Session } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'
import { Button } from './ui/button'

export function SignInOutButton({ session }: { session: Session | null }) {
  const [userFirstName] = session?.user?.name ? session.user.name.split(' ') : ''

  return session ? (
    <Button variant="outline" className="flex items-center gap-2" onClick={() => signOut()}>
      {userFirstName}
      <Avatar>
        <AvatarImage src={session.user?.image ?? ''} alt="avatar" />
        <AvatarFallback>e?</AvatarFallback>
      </Avatar>
    </Button>
  ) : (
    <Button className="" variant="outline" onClick={() => signIn()}>
      log in
    </Button>
  )
}
