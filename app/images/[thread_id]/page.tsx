'use client'

import { ScrollArea } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import { useQueryState } from 'nuqs'

import { useImagesQueryContext } from '@/app/images/ImagesQueryProvider'
import { Composer } from '@/components/composer/Composer'
import { SearchField } from '@/components/form/SearchField'
import { IImageCard } from '@/components/images/IImageCard'
import { InfiniteScroll } from '@/components/ui/InfiniteScroll'
import { Orbit } from '@/components/ui/Ldrs'
import { useThread, useThreadActions } from '@/lib/api'
import { cn, twx } from '@/lib/utils'

const ImagesToolbarWrapper = twx.div`flex-start h-10 shrink-0 border-b border-gray-5 px-1 w-full gap-1 text-sm`
const ResultsGrid = twx.div`grid auto-rows-max grid-cols-2 md:grid-cols-3 gap-2 p-2 xl:grid-cols-4`

export default function Page({ params }: { params: { thread_id: string } }) {
  const pathname = usePathname()
  const thread = useThread(params.thread_id)
  const { latestImages, searchImages } = useImagesQueryContext()

  const [searchParamValue, setSearchParamValue] = useQueryState('search', {
    defaultValue: '',
    clearOnDefault: true,
  })

  const images = searchParamValue ? searchImages : latestImages

  const actions = useThreadActions(thread?._id)

  return (
    <>
      <ImagesToolbarWrapper>
        <SearchField
          size="2"
          radius="small"
          value={searchParamValue}
          onValueChange={setSearchParamValue}
        />
      </ImagesToolbarWrapper>

      <div className="h-96 grow overflow-hidden">
        <ScrollArea scrollbars="vertical">
          <ResultsGrid className="[&>div]:aspect-square">
            {images.results.map((image) => (
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
              isLoading={images.isLoading}
              hasMore={images.status !== 'Exhausted'}
              next={() => images.loadMore(30)}
            >
              <div />
            </InfiniteScroll>
          </ResultsGrid>

          <div className={cn('flex-col-center h-16', images.status === 'Exhausted' && 'hidden')}>
            <div>
              <Orbit />
            </div>
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
