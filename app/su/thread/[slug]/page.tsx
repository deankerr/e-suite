import { Feed } from '@/app/su/thread/[slug]/Feed'
import { ThreadToolbar } from '@/app/su/thread/[slug]/ThreadToolbar'

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <ThreadToolbar slug={params.slug} />
      <Feed slug={params.slug} />
    </>
  )
}
