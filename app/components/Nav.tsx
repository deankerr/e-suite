'use client'

import { cn } from '@/lib/utils'
import { UserButton as ClerkUserButton, SignInButton } from '@clerk/nextjs'
import { Button } from '@radix-ui/themes'
import sunLogoSvg from '/assets/icons/logo-sunset.svg'
import { useConvexAuth } from 'convex/react'
import NextImage from 'next/image'
import { Slate } from './ui/Slate'

type NavProps = {
  setAuthenticated?: boolean
  userOpen: boolean
} & React.ComponentProps<'div'>

export const Nav = ({ setAuthenticated, userOpen, className }: NavProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <Slate
      className={cn(
        'grid h-16 w-20 justify-items-center bg-panel-solid transition-all duration-200',
        className,
        userOpen && 'h-32',
      )}
    >
      <TheSun />
      <UserSignInButton userOpen={userOpen} isAuthenticated={isAuthenticated} />
    </Slate>
  )
}

type TheSunProps = {
  props?: any
}

export const TheSun = ({ props }: TheSunProps) => {
  return (
    <button className="size-16 cursor-pointer p-2">
      <NextImage src={sunLogoSvg} alt="e/suite sun logo" className="" />
    </button>
  )
}

export const UserSignInButton = ({
  isAuthenticated,
  userOpen,
  className,
  ...props
}: { isAuthenticated?: boolean; userOpen: boolean } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'top-0 grid size-14 place-content-center opacity-100 transition-all',
        !userOpen && '-top-full opacity-0',
        className,
      )}
    >
      {isAuthenticated ? (
        <ClerkUserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: { width: '2.8rem', height: '2.8rem' } } }}
        />
      ) : (
        <SignInButton mode="modal">
          <Button variant="surface" color="orange" className="-mx-2 -mt-0.5 cursor-pointer">
            Sign in
          </Button>
        </SignInButton>
      )}
    </div>
  )
}
