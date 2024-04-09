'use client'

import { Card, Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import Link from 'next/link'

import { Logo } from '@/components/ui/Logo'
import { api } from '@/convex/_generated/api'

export default function DevUserPage() {
  // DevUserPage
  const threads = useQuery(api.threads.list, {})

  return (
    <div className="flex min-h-full">
      <Card className="m-auto">
        <div className="space-y-8 p-8">
          <div className="flex items-center gap-3">
            <Logo className="size-16 sm:size-20" />
            <span className="text-4xl sm:text-5xl">e/suite</span>
          </div>

          <div>
            <Heading>Threads</Heading>
            <div>
              {threads?.map((t, i) => (
                <div key={t._id}>
                  <Link href={`/t/${t._id}`}>{t.title ?? `thread ${i}`}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
