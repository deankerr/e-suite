'use client'

import { navbarOpenAtom } from '@/components/atoms'
import { ChangeUsernameDialog } from '@/components/ChangeUsernameDialog'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { UIIconButton } from '@/components/ui/UIIconButton'
import { api } from '@/convex/_generated/api'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Card, Strong } from '@radix-ui/themes'
import { AuthLoading, Unauthenticated, useConvexAuth, useQuery } from 'convex/react'
import { useAtom } from 'jotai'
import { MenuIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.getViewer, isAuthenticated ? {} : 'skip')

  const [navbarIsOpen, setNavbarOpen] = useAtom(navbarOpenAtom)

  return (
    <div className="flex w-full flex-col">
      {/* header */}
      <div className="flex-between h-14 shrink-0 border-b px-3 sm:gap-2">
        {/* open navbar button */}
        {!navbarIsOpen && (
          <UIIconButton
            label="toggle navigation bar"
            className="sm:hidden"
            size="3"
            onClick={() => setNavbarOpen(!navbarIsOpen)}
          >
            <MenuIcon className="size-7" />
          </UIIconButton>
        )}
      </div>

      <div className="flex-center h-full p-4">
        {/* title card */}
        <Card className="min-h-72">
          <div className="flex flex-col gap-10 px-12 py-6">
            <div className="flex items-center gap-3">
              <Logo className="size-16 sm:size-20" />
              <span className="text-4xl sm:text-5xl">e/suite</span>
            </div>

            {isAuthenticated && user ? (
              <div className="flex w-full flex-col items-center gap-5">
                <div className="text-lg">
                  Welcome <Strong>@{user.username}</Strong>
                </div>
                <ChangeUsernameDialog currentUsername={user.username}>
                  <Button>Change username</Button>
                </ChangeUsernameDialog>
              </div>
            ) : null}

            <Unauthenticated>
              <div className="flex flex-col gap-5">
                <SignUpButton mode="modal">
                  <Button size="3">Create account</Button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <Button size="3">Log in</Button>
                </SignInButton>
              </div>
            </Unauthenticated>

            <AuthLoading>
              <div className="flex w-full justify-center">
                <LoaderBars className="mx-auto w-28" />
              </div>
            </AuthLoading>
          </div>
        </Card>
      </div>
    </div>
  )
}
