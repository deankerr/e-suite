'use client'

import { useThreads } from '@/lib/api'

export const ThreadTitle = ({ slug }: { slug: string }) => {
  const { thread } = useThreads(slug)
  return (
    <h1 className="truncate px-1 text-sm font-medium">
      {thread === null
        ? 'Error'
        : thread === undefined
          ? 'Loading...'
          : (thread?.title ?? 'Untitled Thread')}
    </h1>
  )
}
