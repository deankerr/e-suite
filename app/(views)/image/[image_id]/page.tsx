import { ImagePage } from '@/components/_v/ImagePage'

export default function Page({ params }: { params: { image_id: string } }) {
  return <ImagePage params={params} />
}
