import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

export const useChatModels = () => {
  return useCachedQuery(api.db.models.listChatModels, {})
}
