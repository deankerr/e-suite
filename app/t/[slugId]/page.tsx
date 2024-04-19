import { fetchQuery } from 'convex/nextjs'
import { Metadata } from 'next'

import { api } from '@/convex/_generated/api'
import { getAuthToken } from '@/lib/auth'
import ThreadPage from './ThreadPage'

export async function generateMetadata({
  params,
}: {
  params: { slugId: string }
}): Promise<Metadata> {
  const token = await getAuthToken()
  const slugId = params.slugId
  const thread = await fetchQuery(api.threads.getBySlugId, { slugId }, { token })

  return {
    title: `e/suite / Thread / ${thread?.title ?? 'Untitled Thread'}`,
  }
}

export default function TSlugIdPage({ params: { slugId } }: { params: { slugId: string } }) {
  return <ThreadPage slugId={slugId} />
}
