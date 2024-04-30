'use client'

import { useEffect } from 'react'
import { useControls } from 'leva'
import { ImagesIcon } from 'lucide-react'

import { GenerationImage } from '@/components/images/GenerationImage'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { Spinner } from '@/components/ui/Spinner'
import { useTitle } from '@/lib/hooks'
import { useInsecureDemoOnlyGeneraitonList } from '@/lib/queries'
import { PageHeader } from './PageHeader'

export const ImageGridPage = () => {
  useTitle('image feed')

  const pager = useInsecureDemoOnlyGeneraitonList()

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
    <>
      <PageHeader icon={<ImagesIcon className="size-5 stroke-[1.5]" />} title="image feed" />
      <div className="px-1 py-4">
        <JustifiedRowGrid
          items={pager.results}
          gap={8}
          render={(generation, commonHeight) => (
            <GenerationImage
              key={generation._id}
              generation={generation}
              imageProps={{ priority: count++ < 10 }}
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
      </div>
    </>
  )
}
