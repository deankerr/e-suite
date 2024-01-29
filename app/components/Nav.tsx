'use client'

import { cn } from '@/lib/utils'
import { UserButton as ClerkUserButton, SignInButton } from '@clerk/nextjs'
import { Button } from '@radix-ui/themes'
import sunLogoSvg from '/assets/icons/logo-sunset.svg'
import { useConvexAuth } from 'convex/react'
import NextImage from 'next/image'
import { Slate } from './ui/Slate'

type NavProps = {
  tt?: boolean
} & React.ComponentProps<'div'>

export const Nav = ({ tt, className }: NavProps) => {
  return (
    <Slate
      className={cn(
        'h-s[130px] flex w-20 flex-col items-center justify-between bg-panel-solid transition-all *:border-none',
        className,
      )}
    >
      <TheSun />
      <UserSignInButton isAuthenticated={tt && true} />
    </Slate>
  )
}

type TheSunProps = {
  props?: any
}

export const TheSun = ({ props }: TheSunProps) => {
  return (
    <button className="size-16 cursor-pointer border border-ruby-9 p-2">
      <NextImage src={sunLogoSvg} alt="e/suite sun logo" className="" />
    </button>
  )
}

export const UserSignInButton = ({
  isAuthenticated,
  className,
  ...props
}: { isAuthenticated?: boolean } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn('grid size-14 place-content-center border border-lime-9', className)}
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

//[&>div]:-top-[3.7rem]
