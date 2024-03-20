import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { getAuthToken } from '@/lib/auth'
import { preloadQuery } from 'convex/nextjs'
import { Chat } from './Chat'

export default async function ChatPage({ params }: { params: { slug?: [Id<'threads'>] } }) {
  const threadId = params.slug ? params.slug[0] : undefined

  const token = await getAuthToken()
  const preloadedThread = await preloadQuery(api.threads.threads.get, { id: threadId }, { token })

  return <Chat preload={preloadedThread} />
}
