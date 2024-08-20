import { Modal } from '@/app/(views)/images/[thread_id]/@modal/(...)image/[image_id]/Modal'
import { ImagePageLoader1 } from '@/components/_v/ImagePage'

export default function Page({ params }: { params: { image_id: string; thread_id: string } }) {
  return (
    <Modal closePathname={`/images/${params.thread_id}`}>
      <ImagePageLoader1 params={params} />
    </Modal>
  )
}
