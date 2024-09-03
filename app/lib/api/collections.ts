import { useCacheQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

export const useCollections = () => {
  const collections = useCacheQuery(api.db.collections.latest, {})
  return collections
}

export const useCollection = (collectionId: string) => {
  const collections = useCacheQuery(api.db.collections.latest, {})
  if (collections === null) return null
  return collections?.find((c) => c.id === collectionId)
}
