import { preloadQuery } from 'convex/nextjs'

import { Modal } from '@/app/(views)/images/[thread_id]/@modal/(...)image/[image_id]/Modal'
import { ImagePagePreloaded } from '@/components/_v/ImagePage'
import { api } from '@/convex/_generated/api'

export default async function Page({
  params,
}: {
  params: { image_id: string; thread_id: string }
}) {
  const preloadedImageMessage = await preloadQuery(api.db.images.getImageMessage, {
    uid: params.image_id,
  })
  return (
    <Modal closePathname={`/images/${params.thread_id}`}>
      <ImagePagePreloaded
        preloadedImageMessage={preloadedImageMessage}
        image_id={params.image_id}
      />
    </Modal>
  )
}
