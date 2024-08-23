import { preloadQuery } from 'convex/nextjs'
import { useQuery } from 'convex/react'

import { Modal } from '@/app/images/[thread_id]/@modal/(...)image/[image_id]/Modal'
import { ImageDetailPage, ImageMessageDetailPageLoader } from '@/components/pages/ImageDetailPage'
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
  const image = useQuery(api.db.images.getById, {
    id: params.image_id,
  })

  return <Modal>{image && <ImageDetailPage images={[image]} currentImageId={image.id} />}</Modal>
}
