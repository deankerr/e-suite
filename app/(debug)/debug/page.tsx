'use client'

import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Card, Strong } from '@radix-ui/themes'
import { AuthLoading, Unauthenticated, useConvexAuth, useQuery } from 'convex/react'

import { Button } from '@/components/ui/Button'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { Logo } from '@/components/ui/Logo'
import { api } from '@/convex/_generated/api'

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.getSelf, isAuthenticated ? {} : 'skip')

  return (
    <div className="flex w-full flex-col">
      <div className="flex-col-center h-full gap-2 p-4">
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
                  Welcome <Strong>@{user.name}</Strong>
                </div>

                <pre className="max-w-[80vw] overflow-y-auto bg-black p-4">
                  {JSON.stringify(user, null, 2)}
                </pre>
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
