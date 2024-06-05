import { useQuery } from 'convex-helpers/react'

import { api } from '@/convex/_generated/api'

export const useUserThreadsList = () => {
  const result = useQuery(api.db.threads.list, {})
  result.data?.sort((a, b) => b.latestActivityTime - a.latestActivityTime)
  return result
}
