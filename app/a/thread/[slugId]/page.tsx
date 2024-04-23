'use client'

import { Button } from '@radix-ui/themes'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { MessageSquareIcon } from 'lucide-react'

import { PageHeader } from '@/app/(main)/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { api } from '@/convex/_generated/api'
import { MessageGallery } from '../../MessageGallery'

const showLoader = false

export default function TSlugIdPage({ params: { slugId } }: { params: { slugId: string } }) {
  const thread = useQuery(api.threads.getBySlugId, { slugId })
  const queryKey = thread ? { threadId: thread._id, order: 'desc' as const } : 'skip'
  const pager = usePaginatedQuery(api.messages.listEdges, queryKey, { initialNumItems: 5 })

  return (
    <div>
      <PageHeader title={thread?.title ?? ''} icon={<MessageSquareIcon />} />

      <div className="space-y-4 p-1 sm:p-4">
        {(showLoader || pager.status === 'LoadingFirstPage') && (
          <>
            <MsgSkele />
            <MsgSkele />
            <MsgSkele />
          </>
        )}

        {pager.results.map(({ message, generations }) => (
          <MessageGallery key={message._id} message={message} generations={generations} />
        ))}
      </div>

      {pager.status !== 'LoadingFirstPage' && (
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
    </div>
  )
}

const MsgSkele = () => (
  <Skeleton className="space-y-3 border border-gray-3">
    <Skeleton className="h-10 rounded-none rounded-t-md bg-gray-3"></Skeleton>
    <Skeleton className="h-64 gap-2 bg-gray-2 p-3 pt-0 flex-start">
      <Skeleton className="h-full w-64 bg-gray-3" />
      <Skeleton className="h-full w-64 bg-gray-3" />
      <Skeleton className="h-full w-64 bg-gray-3" />
      <Skeleton className="h-full w-64 bg-gray-3" />
      <Skeleton className="h-full w-64 bg-gray-3" />
    </Skeleton>
  </Skeleton>
)
