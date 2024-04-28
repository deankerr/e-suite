import { usePaginatedQuery, useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'

export const useThreadFeed = ({ rid }: { rid: string }) => {
  const thread = useQuery(api.threads.get, { rid })
  const pager = usePaginatedQuery(api.threads.messages, { rid }, { initialNumItems: 5 })

  return { thread, pager }
}

export const useMessageQuery = ({ rid }: { rid: string }) => {
  const result = useQuery(api.messages.get, { rid })

  return result
}
