'use client'

import { usePaginatedQuery } from 'convex/react'

import { Section } from '@/components/ui/Section'
import { api } from '@/convex/_generated/api'
import { GenerationCard } from './GenerationCard'

export const Generations = () => {
  const generations = usePaginatedQuery(api.db.generations.list, {}, { initialNumItems: 10 })

  return (
    <Section className="overflow-y-auto border-none bg-transparent px-1">
      <div className="flex flex-col gap-4">
        {generations.results.map((gen) => (
          <GenerationCard key={gen._id} generation={gen} />
        ))}
      </div>
    </Section>
  )
}
