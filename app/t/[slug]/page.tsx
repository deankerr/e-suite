import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({ params }: { params: { slug: string } }) {
  return <ThreadPage slug={params.slug} />
}
