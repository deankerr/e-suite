'use client'

import { usePaginatedQuery } from 'convex/react'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ImageCard } from '@/components/images/ImageCard'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

export default function Page() {
  const imagesQuery = usePaginatedQuery(api.db.admin.see.latestImages, {}, { initialNumItems: 50 })

  return (
    <AdminPageWrapper className="">
      <div className="grid grid-cols-4 place-items-center gap-3">
        {imagesQuery.results.map((image) =>
          image ? <ImageCard key={image._id} image={image} imageProps={{ sizes: '25vw' }} /> : null,
        )}
      </div>

      <InfiniteScroll
        hasMore={imagesQuery.status === 'CanLoadMore'}
        isLoading={imagesQuery.isLoading}
        next={() => imagesQuery.loadMore(50)}
      >
        <div className={cn('mx-auto mt-1', imagesQuery.status === 'Exhausted' && 'hidden')}>
          <LoadingSpinner variant="infinity" className="bg-accentA-11" />
        </div>
      </InfiniteScroll>
    </AdminPageWrapper>
  )
}
