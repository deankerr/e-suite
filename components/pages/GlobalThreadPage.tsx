'use client'

import { MessagesSquareIcon } from 'lucide-react'

import { ThreadMessage } from '@/components/threads/ThreadMessage'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGlobalThreadPage, useThreadRidAtom } from '@/lib/api'
import InfiniteScroll from '../ui/InfiniteScroll'
import { Spinner } from '../ui/Spinner'
import { PageHeader } from './PageHeader'

export const GlobalThreadPage = ({ rid }: { rid: string }) => {
  const [globalRid, setGlobalRid] = useThreadRidAtom()
  if (rid !== globalRid) setGlobalRid(rid)

  const { thread, messages, status, isLoading } = useGlobalThreadPage()
  const title = `<GLOBAL>${thread?.title}`

  return (
    <>
      <PageHeader icon={<MessagesSquareIcon className="size-5 stroke-[1.5]" />} title={title} />
      <div className="space-y-4 p-1 sm:p-4">
        {!thread && <LoadingSkeleton />}

        {thread &&
          messages.map((result, i) => (
            <ThreadMessage key={result.message._id} {...result} thread={thread} priority={i < 3} />
          ))}

        {thread && (
          <InfiniteScroll
            hasMore={status === 'CanLoadMore'}
            isLoading={isLoading}
            next={() => console.log('moar')}
            threshold={1}
          >
            {status !== 'Exhausted' && (
              <div className="mx-auto text-center">
                <Spinner className="size-8" />
              </div>
            )}
          </InfiniteScroll>
        )}
      </div>
    </>
  )
}

const LoadingSkeleton = () => {
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
