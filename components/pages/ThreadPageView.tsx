'use client'

import { MessagesSquareIcon } from 'lucide-react'

import { useTitle } from '@/app/hooks'
import { useThreadFeed } from '@/app/queries'
import { PageWrapper } from '@/components/pages/PageWrapper'
import { ThreadMessage } from '@/components/ThreadMessage'
import { Skeleton } from '@/components/ui/Skeleton'
import { CreateMessageControlsAlpha } from '../CreateMessageControlsAlpha'
import InfiniteScroll from '../ui/InfiniteScroll'
import { Spinner } from '../ui/Spinner'

import type { Id } from '@/convex/_generated/dataModel'

const forceLoadingState = false

export const ThreadPageView = ({ rid }: { rid: string }) => {
  const { thread, pager } = useThreadFeed({ rid })

  const shouldShowLoader = forceLoadingState || pager.status === 'LoadingFirstPage'

  const title = thread?.title ?? 'Thread'
  useTitle(title)

  return (
    <PageWrapper icon={<MessagesSquareIcon />} title={title}>
      <div className="space-y-4 p-1 sm:p-4">
        {shouldShowLoader && <LoadingSkeleton />}

        {thread && <CreateMessageControlsAlpha threadId={thread._id as Id<'threads'>} />}
        {!shouldShowLoader && thread && (
          <>
            {pager.results.map((result, i) => (
              <ThreadMessage
                key={result.message._id}
                {...result}
                thread={thread}
                priority={i < 3}
              />
            ))}
            <InfiniteScroll
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
            </InfiniteScroll>
          </>
        )}
      </div>
    </PageWrapper>
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
