'use client'

import { SidebarToggleButton } from '@/app/components/SidebarToggle'
import { SignInButton, UserButton } from '@clerk/nextjs'
import logo from '/assets/icons/logo-sunset.svg'
import { useConvexAuth } from 'convex/react'
import Image from 'next/image'
import Link from 'next/link'

type NavbarProps = {
  props?: any
}

export const Navbar = ({ props }: NavbarProps) => {
  const { isLoading, isAuthenticated } = useConvexAuth()

  return (
    <nav className="left-4 top-2 z-50 flex items-center justify-between gap-2 place-self-start rounded border border-accent-2 bg-accent-1 px-2 py-2">
      {/* <SidebarToggleButton className="left-sidebar-toggle" /> */}
      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} alt="e/drop logo" className="-mr-0.5 size-5" priority />
      </Link>

      {!isLoading && !isAuthenticated && <SignInButton mode="modal" />}

      <UserButton afterSignOutUrl="/" />

      <SidebarToggleButton className="right-sidebar-toggle" />
    </nav>
  )
}
