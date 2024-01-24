'use client'

import { SignInButton, UserButton } from '@clerk/nextjs'
import { Card } from '@radix-ui/themes'
import logo from '/assets/icons/logo-sunset.svg'
import { useConvexAuth } from 'convex/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRegisterUser } from './useRegisterUser'

type NavbarProps = {
  props?: any
}

export const Navbar = ({ props }: NavbarProps) => {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const userId = useRegisterUser()

  return (
    <Card className="z-30 place-self-start opacity-60 hover:opacity-100" size="1">
      <nav className="flex items-center justify-between gap-1">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="e/drop logo" className="-my-0.5 -mr-0.5 size-9" priority />
        </Link>

        {!isLoading && !isAuthenticated && <SignInButton mode="modal" />}
        <UserButton afterSignOutUrl="/" />
      </nav>
    </Card>
  )
}
