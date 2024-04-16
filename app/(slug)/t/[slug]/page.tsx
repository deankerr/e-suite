import { fetchQuery } from 'convex/nextjs'
import { Metadata } from 'next'

import { api } from '@/convex/_generated/api'
import { getAuthToken } from '@/lib/auth'
import { ThreadView } from './ThreadView'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const token = await getAuthToken()
  const slug = params.slug
  const thread = await fetchQuery(
    api.threads.getBySlug,
    { slug, isMetadataRequest: true },
    { token },
  )

  return {
    title: `e/suite / Thread / ${thread?.title ?? 'Untitled Thread'}`,
  }
}

export default async function TSlugPage({ params: { slug } }: { params: { slug: string } }) {
  return <ThreadView slug={slug} />
}
