'use client'

import { useQuery } from 'convex/react'

import { ImageThumb } from '@/components/ImageThumb'
import { api } from '@/convex/_generated/api'

export default function Page({ params: { slugId } }: { params: { slugId: string } }) {
  const image = useQuery(api.generated_images.getBySlugId, slugId ? { slugId } : 'skip')

  return (
    <div className="">
      {image && (
        <ImageThumb image={image.image} generation={image.generation} className="mx-auto w-1/2" />
      )}
    </div>
  )
}
