import { ImageDetailPage } from '@/components/pages/ImageDetailPage'

export default function Page({ params }: { params: { image_id: string } }) {
  return (
    <>
      <ImageDetailPage imageId={params.image_id} />
    </>
  )
}
