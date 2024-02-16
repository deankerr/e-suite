'use client'

import { ThreadShell } from '@/components/threads/ThreadShell'
import { Id } from '@/convex/_generated/dataModel'

const ThreadSlugPage = ({ params }: { params: { slug: [Id<'threads'>] } }) => {
  const [threadId] = params.slug

  return <ThreadShell threadId={threadId} />
}

export default ThreadSlugPage
