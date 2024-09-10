import { usePaginatedQuery } from 'convex/react'

import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

export const useCollections = () => {
  const collections = useCachedQuery(api.db.collections.latest, {})
  return collections
}

export const useCollection = (collectionId: string) => {
  const collections = useCachedQuery(api.db.collections.latest, {})
  if (collections === null) return null
  return collections?.find((c) => c.id === collectionId)
}

export const useCollectionImages = (collectionId?: string, order?: 'asc' | 'desc') => {
  const images = usePaginatedQuery(
    api.db.collections.listImages,
    collectionId ? { collectionId, order } : 'skip',
    { initialNumItems: 24 },
  )
  return collectionId ? images : undefined
}
