import { ThreadImagesView } from '@/components/pages/ThreadImagesView'
import { ThreadPanel } from '@/components/panel/ThreadPanel'

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { images?: string }
}) {
  const slug = params.slug ?? ''
  const showImageView = searchParams?.images !== undefined

  return <>{showImageView ? <ThreadImagesView slug={slug} /> : <ThreadPanel />}</>
}
