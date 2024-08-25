'use client'

import { Modal } from '@/app/images/[thread_id]/@modal/(.)[image_id]/Modal'
import { useImagesQueryContext } from '@/app/images/ImagesQueryProvider'
import { ImageGalleryPage } from '@/components/pages/ImageGalleryPage'
import { LineZoom } from '@/components/ui/Ldrs'

export default function Page({ params }: { params: { image_id: string; thread_id: string } }) {
  const { galleryImages } = useImagesQueryContext()

  return (
    <Modal>
      {galleryImages ? (
        <ImageGalleryPage
          imageId={params.image_id}
          images={galleryImages}
          basePath={`/images/${params.thread_id}`}
        />
      ) : (
        <div className="flex-col-center h-full">
          <LineZoom />
        </div>
      )}
    </Modal>
  )
}
