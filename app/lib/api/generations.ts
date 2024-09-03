import { usePaginatedQuery } from 'convex/react'

import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

export const useGenerations = () => {
  const generations = usePaginatedQuery(api.db.generations.list, {}, { initialNumItems: 20 })
  return generations
}

export const useGeneration = (generationId: Id<'generations_v2'>) => {
  const generation = useCachedQuery(api.db.generations.getV2, {
    generationId,
  })
  return generation
}
