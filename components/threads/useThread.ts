'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'

export const useThread = (args: { threadId?: Id<'threads'> }) => {
  const threadId = args.threadId
  const queryKey = threadId ? { id: threadId } : 'skip'

  const thread = useQuery(api.threads.threads.get, queryKey)

  return { thread }
}
