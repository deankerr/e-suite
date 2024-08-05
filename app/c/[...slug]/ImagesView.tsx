'use client'

import { ScrollArea } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'

import { ImageCard } from '@/components/images/ImageCard'
import { useLightbox } from '@/components/lightbox/hooks'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

export const ThreadImagesView = ({ slug }: { slug: string }) => {
  const messages = usePaginatedQuery(
    api.db.threads.listMessages,
    { slugOrId: slug, byMediaType: 'images' },
    {
      initialNumItems: 16,
    },
  )
  const openLightbox = useLightbox()
  return (
    <ScrollArea scrollbars="vertical">
      <div className="grid grid-cols-3 gap-2 p-2">
        {messages.results.map((message) =>
          message.images.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              imageProps={{
                sizes: '25vw',
                onClick: () =>
                  openLightbox({
                    slides: [
                      {
                        type: 'image' as const,
                        src: `/i/${image.uid}`,
                        width: image.width,
                        height: image.height,
                        blurDataURL: image.blurDataUrl,
                      },
                    ],
                    index: 0,
                  }),
              }}
              className="max-h-[400px] cursor-pointer"
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
    </ScrollArea>
  )
}
