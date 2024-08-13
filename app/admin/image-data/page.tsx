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
    <AdminPageWrapper>
      <div className="space-y-4">
        {imagesQuery.results.map((image) => (
          <div key={image._id} className="grid grid-cols-2 gap-2">
            <ImageCard image={image} imageProps={{ sizes: '50vw' }} />

            <div className="divide-y [&>div]:p-2">
              <div className="font-mono text-xs" style={{ backgroundColor: image.color }}>
                {image._id}
              </div>

              {image.generationData && (
                <>
                  <div>prompt: {image.generationData?.prompt}</div>
                  <div>model: {image.generationData?.modelName}</div>
                </>
              )}
              <DataItem
                label="nsfw"
                value={image.nsfwProbability ? image.nsfwProbability.toFixed(4) : ''}
              />
              <div>
                <DataItem label="captionModelId" value={image.captionModelId} />
                <DataItem label="captionTitle" value={image.captionTitle} />
                <DataItem label="captionDescription" value={image.captionDescription} />
                <DataItem label="captionOCR" value={image.captionOCR} />
              </div>

              {image.objects ? (
                <div>
                  <div>
                    Objects detected{' '}
                    <span className="font-mono text-gray-11">{image.objectsModelId}</span>
                  </div>
                  <div className="columns-3 text-sm">
                    {image.objects
                      .filter((obj) => obj.score >= 0.1)
                      .map((obj, i) => (
                        <div key={i}>
                          <DataItem label={obj.label} value={obj.score.toFixed(2)} />
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}

              <pre className="font-mono text-xs">{JSON.stringify(image, null, 2)}</pre>
            </div>
          </div>
        ))}
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

const DataItem = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div>
      <span className="font-medium text-gray-11">{label}:</span>{' '}
      {value ?? <span className="text-red-11">blank</span>}
    </div>
  )
}
