import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

export const useViewer = () => {
  return useCachedQuery(api.db.users.getViewer, {})
}
