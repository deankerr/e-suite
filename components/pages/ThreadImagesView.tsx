'use client'

import { usePaginatedQuery } from 'convex/react'

import { ImageCard } from '@/components/images/ImageCard'
import { SectionPanel } from '@/components/pages/SectionPanel'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { api } from '@/convex/_generated/api'
import { useThreads } from '@/lib/api'
import { cn } from '@/lib/utils'

export const ThreadImagesView = ({ slug }: { slug: string }) => {
  const { thread } = useThreads(slug)

  const messages = usePaginatedQuery(
    api.db.threads.listMessages,
    { slugOrId: slug, byMediaType: 'images' },
    {
      initialNumItems: 16,
    },
  )
  return (
    <SectionPanel title={`${thread?.title} Images`}>
      <div className="grid grid-cols-3 gap-2 p-2">
        {messages.results.map((message) =>
          message.images.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              imageProps={{ sizes: '25vw' }}
              className="max-h-[400px]"
            />
          )),
        )}
        <InfiniteScroll
          hasMore={messages.status === 'CanLoadMore'}
          isLoading={messages.isLoading}
          next={() => messages.loadMore(32)}
        >
          <div className={cn('flex-col-center', messages.status === 'Exhausted' && 'hidden')}>
            <LoadingSpinner variant="infinity" className="bg-accentA-11" />
          </div>
        </InfiniteScroll>
      </div>
    </SectionPanel>
  )
}
