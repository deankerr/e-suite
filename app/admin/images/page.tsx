'use client'

import { usePaginatedQuery } from 'convex/react'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ImageBR } from '@/components/images/ImageBR'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

export default function Page() {
  const imagesQuery = usePaginatedQuery(
    api.db.admin.see.latestImages,
    { order: 'desc' },
    { initialNumItems: 20 },
  )

  return (
    <AdminPageWrapper className="">
      <div className="grid grid-cols-3 place-items-center gap-3">
        {imagesQuery.results.map((image) => (
          <ImageBR key={image._id} image={image} sizes="33vw" />
        ))}
      </div>

      <InfiniteScroll
        hasMore={imagesQuery.status === 'CanLoadMore'}
        isLoading={imagesQuery.isLoading}
        next={() => imagesQuery.loadMore(20)}
      >
        <div className={cn('mx-auto mt-1', imagesQuery.status === 'Exhausted' && 'hidden')}>
          <LoadingSpinner variant="infinity" className="bg-accentA-11" />
        </div>
      </InfiniteScroll>
    </AdminPageWrapper>
  )
}
