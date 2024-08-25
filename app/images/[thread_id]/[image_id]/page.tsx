'use client'

import { useImagesQueryContext } from '@/app/images/ImagesQueryProvider'
import { ImageGalleryPage } from '@/components/pages/ImageGalleryPage'

export default function Page({ params }: { params: { image_id: string; thread_id: string } }) {
  const { galleryImages } = useImagesQueryContext()

  if (!galleryImages) {
    return null
  }

  return (
    <ImageGalleryPage
      imageId={params.image_id}
      images={galleryImages}
      basePath={`/images/${params.thread_id}`}
    />
  )
}
