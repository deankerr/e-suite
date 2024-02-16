import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { usePaginatedQuery, useQuery } from 'convex/react'

export const useThread = (args: { id?: Id<'threads'> }) => {
  const threadId = args.id
  const queryKey = threadId ? { id: threadId } : 'skip'
  const thread = useQuery(api.threads.threads.get, queryKey)
  const messages = usePaginatedQuery(api.threads.threads.listMessages, queryKey, {
    initialNumItems: 10,
  })

  return { thread, messages }
}
