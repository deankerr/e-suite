'use client'

import { useState } from 'react'
import { TextField } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

import { ImageFile } from '@/components/images/ImageFile'
import { JustifiedRowGrid } from '@/components/images/JustifiedRowGrid'
import { api } from '@/convex/_generated/api'

export default function Page() {
  const images = useQuery(api.generated_images._list, { limit: 50 })
  const [itemsPerRow, setItemsPerRow] = useState(0)
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
        items={images}
        gap={8}
        itemsPerRow={itemsPerRow ?? undefined}
        render={({ rid, width, height, blurDataUrl }, commonHeight) => (
          <ImageFile
            rid={rid}
            width={width}
            height={height}
            blurDataUrl={blurDataUrl}
            style={{ height: `${commonHeight}px` }}
          />
        )}
      />
    </div>
  )
}
