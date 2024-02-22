'use client'

import { FallbackComponent, ThreadShell } from '@/components/threads/ThreadShell'
import { Id } from '@/convex/_generated/dataModel'
import { ErrorBoundary } from 'react-error-boundary'

const ThreadSlugPage = ({ params }: { params: { slug?: [Id<'threads'>] } }) => {
  const threadId = params.slug ? params.slug[0] : undefined

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <ThreadShell threadId={threadId} />
    </ErrorBoundary>
  )
}

export default ThreadSlugPage
