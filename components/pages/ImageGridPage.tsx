'use client'

import { useEffect } from 'react'
import { usePaginatedQuery } from 'convex/react'
import { useControls } from 'leva'

import { GenerationImage } from '@/components/images/GenerationImage'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { Spinner } from '@/components/ui/Spinner'
import { api } from '@/convex/_generated/api'
import { useTitle } from '@/lib/hooks'
import { PageWrapper } from './PageWrapper'

const initial = 10

export const ImageGridPage = () => {
  useTitle('image feed')

  const pager = usePaginatedQuery(api.generation._list, {}, { initialNumItems: 10 })

  const [{ infinite, status }, set] = useControls('ImageGridFeed', () => ({
    infinite: true,
    status: pager.status,
  }))

  useEffect(() => {
    if (status !== pager.status) {
      set({
        status: pager.status,
      })
    }
  }, [pager.status, set, status])

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

      {infinite && (
        <InfiniteScroll
          hasMore={pager.status === 'CanLoadMore'}
          isLoading={pager.isLoading}
          next={() => {
            console.log('load more()', 'current', pager.results.length)
            pager.loadMore(16)
          }}
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
