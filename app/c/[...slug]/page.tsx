import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({ params }: { params: { slug: string[] } }) {
  const threadSlug = params.slug[0] ?? ''
  const messageSeriesNum = params.slug[1] ?? ''
  return <ThreadPage threadSlug={threadSlug} messageSeriesNum={messageSeriesNum} />
}
