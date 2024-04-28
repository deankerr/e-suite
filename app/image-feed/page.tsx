'use client'

import { useState } from 'react'
import { TextField } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'

import { GenerationImage } from '@/components/images/GenerationImage'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { Spinner } from '@/components/ui/Spinner'
import { api } from '@/convex/_generated/api'
import { useTitle } from '../hooks'

const initial = 10

export default function Page() {
  useTitle('image feed')

  const pager = usePaginatedQuery(api.generation._list, {}, { initialNumItems: 10 })
  const [itemsPerRow, setItemsPerRow] = useState(0)
  let count = 0
  return (
    <div className="p-4">
      <div className="flex p-4">
        <TextField.Root
          value={itemsPerRow}
          onChange={(e) => setItemsPerRow(Number(e.target.value))}
          type="number"
        />
      </div>
      <JustifiedRowGrid
        items={pager.results}
        gap={8}
        itemsPerRow={itemsPerRow ?? undefined}
        render={(generation, commonHeight) => (
          <GenerationImage
            key={generation._id}
            generation={generation}
            imageProps={{ priority: count++ < initial }}
            containerHeight={commonHeight}
          />
        )}
      />

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
    </div>
  )
}
