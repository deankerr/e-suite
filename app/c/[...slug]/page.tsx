import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({ params }: { params: { slug: string[] } }) {
  const slug = params.slug[0] ?? ''
  const mNum = parseInt(params.slug[1] ?? '') || undefined
  return (
    <>
      <ThreadPage slug={slug} mNum={mNum} />
    </>
  )
}
