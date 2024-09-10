'use client'

import { usePaginatedQuery } from 'convex/react'

import { ImageCardNext } from '@/components/images/ImageCardNext'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { InfiniteScroll } from '@/components/ui/InfiniteScroll'
import { Orbit } from '@/components/ui/Ldrs'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

export default function Page() {
  const images = usePaginatedQuery(
    api.db.images.listAllImagesNotInCollection,
    {},
    { initialNumItems: 100 },
  )

  return (
    <Panel>
      <PanelHeader className="gap-1">
        <NavigationButton />
        <PanelTitle href="#">Images without collection</PanelTitle>
      </PanelHeader>

      <VScrollArea>
        <div className="flex flex-wrap gap-2 p-2">
          {images?.results?.map((image, index) => (
            <div key={image._id} className="w-72">
              <ImageCardNext image={image}>
                <div className="absolute inset-0 cursor-pointer" />
              </ImageCardNext>
            </div>
          ))}

          {images?.results?.length === 0 && <div className="text-gray-11">No images found.</div>}

          <InfiniteScroll
            isLoading={images?.isLoading ?? false}
            hasMore={images?.status !== 'Exhausted'}
            next={() => {
              images?.loadMore(24)
              console.log('load more')
            }}
          >
            <div
              className={cn(
                'flex-center w-full py-4 *:invisible',
                images?.status === 'LoadingMore' && '*:visible',
              )}
            >
              <Orbit />
            </div>
          </InfiniteScroll>
        </div>
      </VScrollArea>
    </Panel>
  )
}
