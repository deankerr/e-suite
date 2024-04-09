import { Chat } from '../Chat'

import type { Id } from '@/convex/_generated/dataModel'

export default async function ChatPage({ params }: { params: { slug?: [Id<'threads'>] } }) {
  const threadId = params.slug ? params.slug[0] : undefined

  return <Chat threadId={threadId} />
}
