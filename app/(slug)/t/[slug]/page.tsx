import { fetchQuery, preloadedQueryResult, preloadQuery } from 'convex/nextjs'
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
    title: `e/suite / Thread / ${thread.title ?? 'Untitled Thread'}`,
  }
}

export default async function TSlugPage({ params: { slug } }: { params: { slug: string } }) {
  const token = await getAuthToken()
  const preloadedThread = await preloadQuery(
    api.threads.getBySlug,
    {
      slug: slug,
      isMetadataRequest: false,
    },
    { token },
  )

  const thread = preloadedQueryResult(preloadedThread)

  const preloadedMessages = await preloadQuery(
    api.messages.list,
    {
      threadId: thread._id,
      limit: 20,
    },
    { token },
  )

  return <ThreadView preloadedThread={preloadedThread} preloadedMessages={preloadedMessages} />
}
