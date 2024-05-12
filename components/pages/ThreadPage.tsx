'use client'

import { Suspense } from 'react'

import { MessageCard } from '@/components/cards/MessageCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useThread } from '@/lib/api'

export const ThreadPage = ({ rid }: { rid: string }) => {
  const { messages } = useThread(rid)
  // const title = thread?.title

  return (
    <>
      <div className="space-y-4 p-1 sm:p-4">
        {messages.map((rid, i) => (
          <Suspense key={rid}>
            <MessageCard rid={rid} priority={i < 3} />
          </Suspense>
        ))}

        {/* <InfiniteScroll
          hasMore={pager.status === 'CanLoadMore'}
          isLoading={pager.isLoading}
          next={() => pager.loadMore(8)}
          threshold={1}
        >
          {pager.status !== 'Exhausted' && (
            <div className="mx-auto text-center">
              <Spinner className="size-8" />
            </div>
          )}
        </InfiniteScroll> */}
      </div>
    </>
  )
}

export const LoadingSkeleton = () => {
  return (
    <div className="absolute inset-0 h-[90vh] space-y-4 overflow-hidden p-1 sm:p-4">
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-1"></div>
    </div>
  )
}

const MessageSkeleton = () => (
  <Skeleton className="animate-pulse space-y-3 border border-gray-3 bg-gray-2">
    <Skeleton className="h-10 rounded-none rounded-t-md bg-gray-3"></Skeleton>
    <div className="h-64 gap-2 p-3 pt-0 flex-start">
      <Skeleton className="h-full w-full bg-gray-3" />
      <Skeleton className="h-full w-full bg-gray-3" />
      <Skeleton className="h-full w-full bg-gray-3" />
      <Skeleton className="h-full w-full bg-gray-3" />
    </div>
  </Skeleton>
)
