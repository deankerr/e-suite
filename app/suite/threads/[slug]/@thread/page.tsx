import { ThreadImagesView } from '@/components/pages/ThreadImagesView'
import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug ?? ''

  return (
    <>
      <ThreadImagesView slug={slug} />
    </>
  )
}
