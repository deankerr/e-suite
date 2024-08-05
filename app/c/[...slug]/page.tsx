import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const slug = params.slug[0] ?? ''
  const mNum = parseInt(params.slug[1] ?? '') || undefined

  const imageView = searchParams.imageView === 'true'
  return (
    <>
      <ThreadPage slug={slug} mNum={mNum} imageView={imageView} />
    </>
  )
}
