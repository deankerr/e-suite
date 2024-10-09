import { api } from '@/convex/_generated/api'
import { useCachedQuery } from './helpers'

export const useMessageQuery = (messageId: string) => {
  return useCachedQuery(api.db.messages.get, { messageId })
}
