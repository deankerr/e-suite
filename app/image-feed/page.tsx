'use client'

import { useState } from 'react'
import { TextField } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'

import { GenerationImage } from '@/components/images/GenerationImage'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import { api } from '@/convex/_generated/api'
import { useTitle } from '../hooks'

const initial = 10

export default function Page() {
  useTitle('image feed')

  const images = usePaginatedQuery(api.generation._list, {}, { initialNumItems: 10 })
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
        items={images.results}
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
    </div>
  )
}
