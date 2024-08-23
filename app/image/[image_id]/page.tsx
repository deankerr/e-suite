'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'

import { ImageDetailPage } from '@/components/pages/ImageDetailPage'
import { api } from '@/convex/_generated/api'

export default function Page({ params }: { params: { image_id: string } }) {
  const image = useQuery(api.db.images.get, {
    id: params.image_id,
  })

  return (
    <>
      <ImageDetailPage images={image ? [image] : []} currentImageId={image?.id ?? ''} />
    </>
  )
}
