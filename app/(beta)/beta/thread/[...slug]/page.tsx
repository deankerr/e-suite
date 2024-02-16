'use client'

import { ThreadCShell } from '@/components/threads/ThreadCShell'
import { Id } from '@/convex/_generated/dataModel'

const ThreadSlugPage = ({ params }: { params: { slug: [Id<'threads'>] } }) => {
  const [threadId] = params.slug

  return <ThreadCShell threadId={threadId} />
}

export default ThreadSlugPage
