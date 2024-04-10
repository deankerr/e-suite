'use client'

import { SignInButton, UserButton } from '@clerk/nextjs'
import { Card, Heading } from '@radix-ui/themes'
import { Authenticated, Unauthenticated, useQuery } from 'convex/react'
import Link from 'next/link'

import { Logo } from '@/components/ui/Logo'
import { api } from '@/convex/_generated/api'

export default function ProfilePage() {
  const user = useQuery(api.users.getSelf, {})
  const threads = useQuery(api.threads.list, {})

  return (
    <div className="container min-h-full p-4">
      <Card className="m-auto">
        <div className="space-y-8 p-8">
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <Logo className="size-12" />
              <span className="text-4xl">e/suite</span>
            </div>

            <div className="flex-center">
              <Unauthenticated>
                <SignInButton>Sign in</SignInButton>
              </Unauthenticated>
              <UserButton />
            </div>
          </div>

          <Authenticated>
            <div className="flex gap-2">
              <div className="rounded border p-4">
                <Heading className="mb-2">{user?.name ?? 'User'}</Heading>
                <div>id: {user?._id}</div>
                <div>role: {user?.role}</div>
                <div>api key: {user?.apiKey}</div>
              </div>

              <div className="rounded border p-4">
                <Heading className="mb-2">Threads</Heading>
                <div>
                  {threads?.map((t, i) => (
                    <div key={t._id}>
                      <Link href={`/t/${t.slug}`}>{t.title ?? `thread ${i}`}</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Authenticated>
        </div>
      </Card>
    </div>
  )
}
