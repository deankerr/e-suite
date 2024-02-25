'use client'

import { ChangeUsernameDialog } from '@/components/ChangeUsernameDialog'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { api } from '@/convex/_generated/api'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Card, Strong } from '@radix-ui/themes'
import { AuthLoading, Unauthenticated, useConvexAuth, useQuery } from 'convex/react'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.getViewer, isAuthenticated ? {} : 'skip')

  return (
    <div className="grid w-full place-content-center">
      <Card className="min-h-72">
        <div className="flex flex-col gap-10 px-12 py-6">
          <div className="flex items-center gap-3">
            <Logo className="size-20" />
            <span className="text-5xl">e/suite</span>
          </div>

          {user ? (
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
  )
}
