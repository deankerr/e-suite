'use client'

import { useQuery } from 'convex/react'

import { Modal } from '@/app/images/[thread_id]/@modal/(...)image/[image_id]/Modal'
import { ImageDetailPage } from '@/components/pages/ImageDetailPage'
import { api } from '@/convex/_generated/api'

// export async function generateMetadata({ params }: { params: { image_id: string } }) {
//   const response = await fetch(`${getConvexSiteUrl()}/page?route=image&id=${params.image_id}`)
//   if (!response.ok) return {}

//   const data = await response.json()
//   return {
//     title: data.title,
//     description: data.description,
//   }
// }

export default function Page({ params }: { params: { image_id: string; thread_id: string } }) {
  const image = useQuery(api.db.images.get, {
    id: params.image_id,
  })

  return (
    <Modal>
      <ImageDetailPage images={image ? [image] : []} currentImageId={image?.id ?? ''} />
    </Modal>
  )
}
