import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug ?? ''

  return <ThreadPage slug={slug} />
}
