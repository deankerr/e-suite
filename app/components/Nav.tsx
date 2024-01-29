'use client'

import { cn } from '@/lib/utils'
import { SignInButton as ClerkSignInButton, UserButton as ClerkUserButton } from '@clerk/nextjs'
import { Button } from '@radix-ui/themes'
import sunLogoSvg from '/assets/icons/logo-sunset.svg'
import { useConvexAuth } from 'convex/react'
import { useAtom } from 'jotai'
import NextImage from 'next/image'
import { forceSignedOutUiAtom, navUserPanelOpenAtom } from './atoms'
import { Slate } from './ui/Slate'
import { Spinner } from './ui/Spinner'

type NavProps = {} & React.ComponentProps<'div'>

export const Nav = ({ className }: NavProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const [userPanelOpen, setUserPanelOpen] = useAtom(navUserPanelOpenAtom)
  const [forceSignedOut] = useAtom(forceSignedOutUiAtom)
  return (
    <Slate
      className={cn(
        'grid h-16 w-20 justify-items-center bg-panel-solid transition-all duration-200',
        className,
        userPanelOpen && 'h-32',
      )}
    >
      <TheSun />

      <div
        className={cn(
          'top-0 grid size-14 place-content-center opacity-100 transition-all',
          !userPanelOpen && '-top-full opacity-0',
        )}
      >
        {isLoading && <Spinner className="opacity-50" />}
        {!isLoading && !isAuthenticated && (
          <ClerkSignInButton mode="modal">
            <Button variant="surface" color="orange" className="-mx-2 -mt-0.5 cursor-pointer">
              Sign in
            </Button>
          </ClerkSignInButton>
        )}
        {!isLoading && isAuthenticated && (
          <ClerkUserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: { width: '2.8rem', height: '2.8rem' } } }}
          />
        )}
      </div>
    </Slate>
  )
}

type TheSunProps = {
  props?: any
}

export const TheSun = ({ props }: TheSunProps) => {
  return (
    <button className="size-16 cursor-pointer p-2">
      <NextImage src={sunLogoSvg} alt="e/suite sun logo" className="rounded-full" />
    </button>
  )
}
