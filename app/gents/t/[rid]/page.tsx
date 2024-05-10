'use client'

import { Suspense } from 'react'
import { useQuery } from 'convex/react'

import { useThread } from '@/app/gents/api'
import { MessageFromId } from '@/app/gents/t/[rid]/Message'
import { MessageFromIdSussy } from '@/app/gents/t/[rid]/MessageSussy'
import { api } from '@/convex/_generated/api'

export default function Page({ params }: { params: { rid: string } }) {
  const thread = useThread(params.rid)
  const initMessageList = useQuery(
    api.frontend.listThreadMessages,
    thread ? { threadId: thread._id, limit: 3 } : 'skip',
  )
  const initMessageIds = initMessageList?.map((m) => m._id)

  if (!thread) return <div>No thread</div>
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter">Thread: {thread.title ?? 'untitled'} </h1>
      MessageIds
      <div className="max-w-64 space-y-4 ">
        {initMessageIds?.map((id) => (
          <div key={id} className="space-y-1">
            <div className="font-mono text-xs">{id}</div>
            <div className="flex gap-2">
              <MessageFromId messageId={id} />

              <Suspense fallback={<div className="border bg-mint-5 p-1">outer sussy</div>}>
                <MessageFromIdSussy messageId={id} />
              </Suspense>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
