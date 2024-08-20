'use client'

import Link from 'next/link'

import { Image } from '@/components/images/Image'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { LineZoom, Orbit } from '@/components/ui/Ldrs'
import { useThreadImages } from '@/lib/api'
import { cn } from '@/lib/utils'

export const ImagesFeed = ({ thread_id }: { thread_id: string }) => {
  const { results, loadMore, status, isLoading } = useThreadImages(thread_id)

  if (status === 'LoadingFirstPage')
    return (
      <div className="flex-col-center h-full">
        <LineZoom />
      </div>
    )

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid auto-rows-max grid-cols-3 gap-2 p-2 xl:grid-cols-4">
        {results.map((image) => (
          <Link
            key={image._id}
            href={`/image/${image.uid}`}
            className="overflow-hidden rounded-md border border-grayA-3"
            style={{ aspectRatio: image.width / image.height }}
          >
            <Image
              alt=""
              src={`/i/${image.uid}`}
              placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={image?.blurDataUrl}
              style={{
                objectFit: 'contain',
                objectPosition: 'top',
              }}
              fill
              sizes="(max-width: 1280px) 33vw, 25vw"
            />
          </Link>
        ))}
      </div>

      <div className={cn('flex-col-center h-16', status === 'Exhausted' && 'hidden')}>
        <InfiniteScroll
          isLoading={isLoading}
          hasMore={status !== 'Exhausted'}
          next={() => loadMore(27)}
        >
          <div>
            <Orbit />
          </div>
        </InfiniteScroll>
      </div>
    </div>
  )
}
