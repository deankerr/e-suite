import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

export const useViewer = (isViewerId?: string) => {
  const user = useCachedQuery(api.db.users.getViewer, {})
  const isViewer = isViewerId ? isViewerId === user?._id : false
  return { user, isViewer }
}
