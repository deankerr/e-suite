import { usePaginatedQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'

export const useMyImagesList = (order?: 'asc' | 'desc') => {
  const images = usePaginatedQuery(api.db.images.listMyImages, { order }, { initialNumItems: 24 })
  return images
}
