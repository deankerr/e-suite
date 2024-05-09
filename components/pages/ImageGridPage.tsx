'use client'

import { ImagesIcon } from 'lucide-react'

import { GeneratedImageView } from '@/components/images/GeneratedImageView'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { Spinner } from '@/components/ui/Spinner'
import { useInsecureDemoOnlyGenerationList } from '@/lib/queries'
import { PageHeader } from './PageHeader'

export const ImageGridPage = () => {
  const pager = useInsecureDemoOnlyGenerationList()

  let count = 0
  return (
    <>
      <PageHeader icon={<ImagesIcon className="size-5 stroke-[1.5]" />} title="image feed" />
      <div className="px-1 py-4">
        <JustifiedRowGrid
          items={pager.results}
          gap={8}
          render={(generation, commonHeight) => (
            <GeneratedImageView
              key={generation._id}
              generation={generation}
              imageProps={{ priority: count++ < 10 }}
              containerHeight={commonHeight}
            />
          )}
        />

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
      </div>
    </>
  )
}
