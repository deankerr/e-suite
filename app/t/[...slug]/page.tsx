import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({ params }: { params: { slug: [string, string] } }) {
  console.log(params)
  return <ThreadPage slug={params.slug[0]} series={params.slug[1]} />
}
