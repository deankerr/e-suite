import { usePaginatedQuery, useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'

export const useGenerationsFeed = () => {
  // const r = usePaginatedQuery()
}

export const useThreadFeed = ({ slugId }: { slugId: string }) => {
  const thread = useQuery(api.threads.getBySlugId, { slugId })
  const pager = usePaginatedQuery(api.threads.pageFeed, { slugId }, { initialNumItems: 5 })

  return { thread, pager }
}
