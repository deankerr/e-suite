import { fetchQuery } from 'convex/nextjs'

import { api } from '@/convex/_generated/api'
import { getAuthToken } from '@/lib/auth'
import { MessagePage } from './MessagePage'

import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { slugId: string }
}): Promise<Metadata> {
  const token = await getAuthToken()
  const slugId = params.slugId
  const thread = await fetchQuery(api.messages.getMetadata, { slugId }, { token })

  return {
    title: `Message / ${thread?.title ?? ''}`,
  }
}

export default function MessageSlugIdPage({ params: { slugId } }: { params: { slugId: string } }) {
  // MessagePage

  return <MessagePage slugId={slugId} />
}
