import { preloadQuery } from 'convex/nextjs'

import { Modal } from '@/app/images/[thread_id]/@modal/(...)image/[image_id]/Modal'
import { ImageMessageDetailPageLoader } from '@/components/pages/ImageDetailPage'
import { api } from '@/convex/_generated/api'
import { getConvexSiteUrl } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { image_id: string } }) {
  const response = await fetch(`${getConvexSiteUrl()}/page?route=image&id=${params.image_id}`)
  if (!response.ok) return {}

  const data = await response.json()
  return {
    title: data.title,
    description: data.description,
  }
}

export default async function Page({
  params,
}: {
  params: { image_id: string; thread_id: string }
}) {
  const preloadedImageMessage = await preloadQuery(api.db.images.getImageMessage, {
    uid: params.image_id,
  })
  return (
    <Modal>
      <ImageMessageDetailPageLoader
        preloadedImageMessage={preloadedImageMessage}
        initialImageId={params.image_id}
      />
    </Modal>
  )
}
