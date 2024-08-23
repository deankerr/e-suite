'use client'

import Link from 'next/link'
import { useQueryState } from 'nuqs'

import { Composer } from '@/components/composer/Composer'
import { SearchField } from '@/components/form/SearchField'
import { IImage } from '@/components/images/IImage'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { Orbit } from '@/components/ui/Ldrs'
import {
  useThread,
  useThreadActions,
  useThreadImages,
  useThreadImagesSearch,
  useThreadJobs,
} from '@/lib/api'
import { cn, twx } from '@/lib/utils'

const useImagesFeed = (thread_id: string) => {
  const images = useThreadImages(thread_id)
  const jobs = useThreadJobs(thread_id)
  const generating =
    jobs?.filter(
      (job) => job.name === 'textToImage' && (job.status === 'pending' || job.status === 'active'),
    ) ?? []

  return {
    ...images,
    generating,
  }
}

const ImagesToolbarWrapper = twx.div`flex-start h-10 border-b border-gray-5 w-full gap-1 px-1 text-sm`
const ResultsGrid = twx.div`grid auto-rows-max grid-cols-3 gap-2 p-2 xl:grid-cols-4`

export default function Page({ params }: { params: { thread_id: string } }) {
  const thread = useThread(params.thread_id)

  const imagesFeed = useImagesFeed(params.thread_id)

  const [searchValue, setSearchValue] = useQueryState('search', {
    defaultValue: '',
    clearOnDefault: true,
  })

  const searchImages = useThreadImagesSearch(params.thread_id, searchValue ?? undefined)
  const images = searchValue ? searchImages : imagesFeed

  const actions = useThreadActions(thread?._id)
  return (
    <>
      <ImagesToolbarWrapper>
        <SearchField value={searchValue ?? ''} onValueChange={setSearchValue} />
      </ImagesToolbarWrapper>

      <div className="h-96 grow overflow-hidden">
        <div className="h-full overflow-y-auto">
          <ResultsGrid>
            {images.results.map((image) => (
              <Link
                key={image._id}
                href={`/image/${image.uid}`}
                className="overflow-hidden rounded-md border border-grayA-3"
                style={{ aspectRatio: image.width / image.height }}
              >
                <IImage image={image} />
              </Link>
            ))}
          </ResultsGrid>

          <div className={cn('flex-col-center h-16', images.status === 'Exhausted' && 'hidden')}>
            <InfiniteScroll
              isLoading={images.isLoading}
              hasMore={images.status !== 'Exhausted'}
              next={() => images.loadMore(30)}
            >
              <div>
                <Orbit />
              </div>
            </InfiniteScroll>
          </div>
        </div>
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
