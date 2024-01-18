'use client'

import { api } from '@/convex/_generated/api'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { GenerationCard } from '../components/GenerationCard'

type GenerationFeedProps = {
  props?: any
}

export const GenerationFeed = ({ props }: GenerationFeedProps) => {
  const { results } = usePaginatedQuery(api.generations.page, {}, { initialNumItems: 5 })

  return (
    <div className="flex flex-col items-center gap-8 overflow-y-auto px-4 pb-6 pt-14">
      {results?.map((gen) => <GenerationCard key={gen.generation._id} {...gen} />)}
    </div>
  )
}
