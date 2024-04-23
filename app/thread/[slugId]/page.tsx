'use client'

import { Button } from '@radix-ui/themes'
import { MessageSquareIcon } from 'lucide-react'

import { PageHeader } from '@/app/alpha/PageHeader'
import { useThreadFeed } from '@/app/queries'
import { MessageGallery } from '@/components/ThreadMessage'
import { Skeleton } from '@/components/ui/Skeleton'

const forceLoadingState = false

export default function TSlugIdPage({ params: { slugId } }: { params: { slugId: string } }) {
  const { thread, pager } = useThreadFeed({ slugId })

  const shouldShowLoader = forceLoadingState || pager.status === 'LoadingFirstPage'

  return (
    <div className="min-h-screen">
      <PageHeader title={thread?.title ?? ''} icon={<MessageSquareIcon />} />

      <div className="space-y-4 p-1 sm:p-4">
        {shouldShowLoader && <LoadingSkeleton />}

        {!shouldShowLoader &&
          thread &&
          pager.results.map(({ message, generations }, i) => (
            <MessageGallery
              key={message._id}
              message={message}
              thread={thread}
              generations={generations}
              priority={i < 3}
            />
          ))}
      </div>

      {!shouldShowLoader && (
        <div className="pb-4 flex-center">
          <Button
            variant="surface"
            className="w-1/2"
            disabled={pager.status !== 'CanLoadMore'}
            onClick={() => pager.loadMore(10)}
          >
            load more {pager.status}
          </Button>
        </div>
      )}

      {/* <ModalView>{popMsg ? <MessagePageView {...popMsg} /> : 'wait'}</ModalView> */}
    </div>
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
