'use client'

import { api } from '@/convex/_generated/api'
import { Card, ScrollArea } from '@radix-ui/themes'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { GenerationCard } from '../components/GenerationCard'

type GenerationFeedProps = {
  props?: any
}

export const GenerationFeed = ({ props }: GenerationFeedProps) => {
  const { results } = usePaginatedQuery(api.generations.page, {}, { initialNumItems: 20 })

  return (
    <ScrollArea>
      <div className="gap-8 space-y-8 overflow-y-auto px-4 pb-6 pt-14 md:px-10">
        {results?.map((gen) => (
          <>
            <GenerationCard key={gen.generation._id} {...gen} />
          </>
        ))}
        {results ? (
          results.length ? null : (
            <Card className="mx-auto w-fit">There is nothing here.</Card>
          )
        ) : (
          <Card className="mx-auto w-fit">Loading</Card>
        )}
      </div>
    </ScrollArea>
  )
}
