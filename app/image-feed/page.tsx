'use client'

import { useState } from 'react'
import { TextField } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'

import { JustifiedRowGrid } from '@/components/JustifiedRowGrid'
import { api } from '@/convex/_generated/api'
import { getImageUrl } from '@/lib/utils'

export default function Page() {
  const images = useQuery(api.generated_images._list, { limit: 100 })
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
          <div
            key={rid}
            className="overflow-hidden rounded-lg border"
            style={{ aspectRatio: width / height, height: commonHeight }}
          >
            <NextImage
              unoptimized
              src={getImageUrl(rid)}
              width={width}
              height={height}
              placeholder={blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={blurDataUrl}
              className="h-full w-full object-cover"
              alt=""
            />
          </div>
        )}
      />
    </div>
  )
}
