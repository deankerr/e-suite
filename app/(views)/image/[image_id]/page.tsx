import { preloadQuery } from 'convex/nextjs'

import { ImageMessageDetailPageLoader } from '@/components/pages/ImageDetailPage'
import { api } from '@/convex/_generated/api'

export default async function Page({ params }: { params: { image_id: string } }) {
  const preloadedImageMessage = await preloadQuery(api.db.images.getImageMessage, {
    uid: params.image_id,
  })

  return (
    <>
      <ImageMessageDetailPageLoader
        preloadedImageMessage={preloadedImageMessage}
        initialImageId={params.image_id}
        showHeader
      />
    </>
  )
}
