import { preloadQuery } from 'convex/nextjs'

import { ImagePagePreloaded } from '@/components/_v/ImagePage'
import { api } from '@/convex/_generated/api'

export default async function Page({ params }: { params: { image_id: string } }) {
  const preloadedImageMessage = await preloadQuery(api.db.images.getImageMessage, {
    uid: params.image_id,
  })

  return (
    <ImagePagePreloaded preloadedImageMessage={preloadedImageMessage} image_id={params.image_id} />
  )
}
