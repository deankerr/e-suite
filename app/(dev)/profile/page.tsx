'use client'

import { Card, Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
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
          <div className="flex items-center gap-3">
            <Logo className="size-16 sm:size-20" />
            <span className="text-4xl sm:text-5xl">e/suite</span>
          </div>

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
        </div>
      </Card>
    </div>
  )
}
