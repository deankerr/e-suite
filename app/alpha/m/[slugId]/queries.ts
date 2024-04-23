import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'

export const useMessageQuery = ({ slugId }: { slugId: string }) => {
  const message = useQuery(api.messages.getBySlugId, { slugId })
  return message
}
