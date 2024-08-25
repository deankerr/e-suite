'use client'

import { ScrollArea } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'

import { useImagesQueryContext } from '@/app/images/ImagesQueryProvider'
import { Composer } from '@/components/composer/Composer'
import { IImageCard } from '@/components/images/IImageCard'
import { InfiniteScroll } from '@/components/ui/InfiniteScroll'
import { Orbit } from '@/components/ui/Ldrs'
import { useThread, useThreadActions } from '@/lib/api'
import { cn, twx } from '@/lib/utils'

const ResultsGrid = twx.div`grid auto-rows-max grid-cols-2 md:grid-cols-3 gap-2 p-2 xl:grid-cols-4`

export default function Page({ params }: { params: { thread_id: string } }) {
  const pathname = usePathname()
  const thread = useThread(params.thread_id)
  const { imagesFeed } = useImagesQueryContext()

  const actions = useThreadActions(thread?._id)

  return (
    <>
      <div className="h-96 grow overflow-hidden">
        <ScrollArea scrollbars="vertical">
          <ResultsGrid className="mb-16 [&>div]:aspect-square">
            {imagesFeed.results.map((image) => (
              <IImageCard
                key={image._id}
                image={image}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33.33vw, 50vw"
                href={`${pathname}/${image.id}`}
                style={{ aspectRatio: 1 }}
                className="[&>img]:object-cover"
              />
            ))}

            <InfiniteScroll
              isLoading={imagesFeed.isLoading}
              hasMore={imagesFeed.status !== 'Exhausted'}
              next={() => {
                imagesFeed.loadMore(30)
                console.log('load more')
              }}
            >
              <div className="h-full w-full" />
            </InfiniteScroll>
          </ResultsGrid>

          <div
            className={cn(
              'flex-col-center absolute inset-x-0 bottom-0 h-16',
              imagesFeed.status === 'Exhausted' && 'hidden',
            )}
          >
            <Orbit />
          </div>
        </ScrollArea>
      </div>

      {thread && thread.userIsViewer && (
        <Composer
          initialResourceKey={thread.latestRunConfig?.resourceKey}
          loading={actions.state !== 'ready'}
          onSend={actions.send}
        />
      )}
    </>
  )
}
