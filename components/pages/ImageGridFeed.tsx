'use client'

import { usePaginatedQuery } from 'convex/react'
import { useControls } from 'leva'

import { GenerationImage } from '@/components/images/GenerationImage'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { Spinner } from '@/components/ui/Spinner'
import { api } from '@/convex/_generated/api'
import { useTitle } from '@/lib/hooks'
import { PageWrapper } from './PageWrapper'

type ImageGridFeedProps = { props?: unknown }
const initial = 10
export const ImageGridFeed = ({}: ImageGridFeedProps) => {
  useTitle('image feed')
  const gridDebug = useControls('image-grid', {
    infinite: true,
  })

  const pager = usePaginatedQuery(api.generation._list, {}, { initialNumItems: 10 })

  let count = 0
  return (
    <PageWrapper title="feed">
      <JustifiedRowGrid
        items={pager.results}
        gap={8}
        render={(generation, commonHeight) => (
          <GenerationImage
            key={generation._id}
            generation={generation}
            imageProps={{ priority: count++ < initial }}
            containerHeight={commonHeight}
          />
        )}
      />

      {gridDebug.infinite && (
        <InfiniteScroll
          hasMore={pager.status === 'CanLoadMore'}
          isLoading={pager.isLoading}
          next={() => pager.loadMore(16)}
          threshold={1}
        >
          {pager.status !== 'Exhausted' && (
            <div className="mx-auto text-center">
              <Spinner className="size-8" />
            </div>
          )}
        </InfiniteScroll>
      )}
    </PageWrapper>
  )
}
