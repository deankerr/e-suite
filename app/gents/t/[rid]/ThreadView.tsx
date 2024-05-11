'use client'

import { Suspense } from 'react'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'

import { useMessage, useThread } from '@/app/gents/atoms'

type ThreadViewProps = { rid: string }

export const ThreadView = ({ rid }: ThreadViewProps) => {
  const { thread, messageRids, pager } = useThread(rid)

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter">Thread: {thread.title ?? 'untitled'} </h1>
      Messages:
      {messageRids.map((rid) => (
        <Suspense
          key={rid}
          fallback={<div className="block bg-amber-3 py-2">message summary loading</div>}
        >
          <MessageSummaryLink rid={rid} />
        </Suspense>
      ))}
      <Button onClick={() => pager.loadMore(5)}>{pager.status}</Button>
    </div>
  )
}

const MessageSummaryLink = ({ rid }: { rid: string }) => {
  const { message } = useMessage(rid)

  return (
    <Link key={rid} href={`/gents/m/${rid}`} className="block py-1">
      {message.role} {message.name}
    </Link>
  )
}
