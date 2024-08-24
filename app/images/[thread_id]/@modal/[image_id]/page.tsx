import { Modal } from '@/app/images/[thread_id]/@modal/[image_id]/Modal'
import { ImageDetailPage } from '@/components/pages/ImageDetailPage'

export default function Page({ params }: { params: { image_id: string; thread_id: string } }) {
  return (
    <Modal>
      <ImageDetailPage imageId={params.image_id} />
    </Modal>
  )
}
