'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'
import { preloadQuery } from 'convex/nextjs'

import { ImageDetailPage, ImageMessageDetailPageLoader } from '@/components/pages/ImageDetailPage'
import { api } from '@/convex/_generated/api'

import type { EImage } from '@/convex/types'

export default function Page({ params }: { params: { image_id: string } }) {
  // const preloadedImageMessage = await preloadQuery(api.db.images.getImageMessage, {
  //   uid: params.image_id,
  // })

  const image = useQuery(api.db.images.getById, {
    id: params.image_id,
  })

  return (
    <>
      {/* <ImageMessageDetailPageLoader
        preloadedImageMessage={preloadedImageMessage}
        initialImageId={params.image_id}
      /> */}
      {image && <ImageDetailPage images={[image]} currentImageId={image.id} />}
    </>
  )
}
