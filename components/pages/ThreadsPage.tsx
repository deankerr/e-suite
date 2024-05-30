'use client'

import { useState } from 'react'

import { ThreadInterface } from '@/components/thread/ThreadInterface'
import { useListViewerThreads } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { api } from '@/convex/_generated/api'
import type { Preloaded } from 'convex/react'

type ThreadsPageProps = {
  preloadedThreads: Preloaded<typeof api.threads.query.listViewerThreads>
} & React.ComponentProps<'div'>

export const ThreadsPage = ({ preloadedThreads, className, ...props }: ThreadsPageProps) => {
  const viewerList = useListViewerThreads(preloadedThreads)

  const [threadIds, setThreadIds] = useState<string[]>(
    viewerList.threads.map((thread) => thread.slug),
  )

  return (
    <div
      {...props}
      className={cn(
        'flex h-[calc(100svh-2.75rem)] max-h-full divide-x overflow-x-auto overflow-y-hidden',
        className,
      )}
    >
      {threadIds.map((id) => (
        <ThreadInterface key={id} threadId={id} className="flex-[1_0_min(100vw,24rem)]" />
      ))}
    </div>
  )
}
