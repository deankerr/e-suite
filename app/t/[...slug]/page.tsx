import { MultiThreadViewer } from '@/app/t/[...slug]/MultiThreadViewer'

export default function Page({ params }: { params: { slug: [threadIds: string] } }) {
  return <MultiThreadViewer slug={params.slug} />
}
