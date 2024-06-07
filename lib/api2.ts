import { useQuery } from 'convex-helpers/react'

import { api } from '@/convex/_generated/api'

export const useThread = (slugOrId: string) => {
  const result = useQuery(api.db.threads.get, {
    slugOrId,
  })
  return result
}

export const useUserThreadsList = () => {
  const result = useQuery(api.db.threads.list, {})
  result.data?.sort((a, b) => b.updatedAtTime - a.updatedAtTime)
  return result
}

export const useMessagesList = (
  threadId: string,
  options: { limit?: number; order?: 'asc' | 'desc' } = {},
) => {
  const result = useQuery(api.db.messages.list, {
    threadId,
    ...options,
  })

  return result
}
