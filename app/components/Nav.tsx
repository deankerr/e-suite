'use client'

import { cn } from '@/lib/utils'
import { SignInButton as ClerkSignInButton, UserButton as ClerkUserButton } from '@clerk/nextjs'
import { Button, Card } from '@radix-ui/themes'
import { useConvexAuth } from 'convex/react'
import { useAtom } from 'jotai'
import NextImage from 'next/image'
import { GenerationBar } from './GenerationBar'
import {
  getUiAtom,
} from './atoms'
import { Slate } from './ui/Slate'
import { Spinner } from './ui/Spinner'
import sunLogoSvg from '/assets/logo-sunset.svg'

type NavProps = {} & React.ComponentProps<'div'>

export const Nav = ({ className }: NavProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const [userPanelOpen] = useAtom(
    getUiAtom('userPanelOpen'),
  )

  const [generationsPanelOpen] = useAtom(
    getUiAtom('generationsPanelOpen')
  )

  return (
    <>
      <Slate
        className={cn(
          'inset-2 grid h-16 w-20 justify-items-center bg-panel-solid transition-all duration-300',
          className,
          userPanelOpen && 'h-32',
        )}
      >
        <TheSun />

        <div
          className={cn(
            'top-0 grid size-14 place-content-center opacity-100 transition-all duration-300',
            !userPanelOpen && '-top-full opacity-0',
          )}
        >
          {isLoading ? (
            <Spinner className="opacity-50" />
          ) : isAuthenticated ? (
            <ClerkUserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: { width: '2.8rem', height: '2.8rem' } } }}
            />
          ) : (
            <ClerkSignInButton mode="modal">
              <Button variant="surface" color="orange" className="-mx-2 -mt-0.5 cursor-pointer">
                Sign in
              </Button>
            </ClerkSignInButton>
          )}
        </div>
      </Slate>

      <Card
        className={cn(
          'left-[5.5rem] z-20 self-start justify-self-start bg-panel-solid transition-all duration-1000',
          generationsPanelOpen ? '' : '-left-[100%]',
        )}
      >
        <GenerationBar show={generationsPanelOpen} />
      </Card>
    </>
  )
}


export const TheSun = () => {
  return (
    <button className="after:sun-glow2 size-16 cursor-pointer p-2">
      <NextImage src={sunLogoSvg} alt="e/suite sun logo" className="rounded-full" />
    </button>
  )
}
