'use client'

import { api } from '@/convex/_generated/api'
import { Card, ScrollArea } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'
import { Generation } from './Shell/Generation'

type GenerationFeedProps = {
  props?: any
}

export const GenerationFeed = ({ props }: GenerationFeedProps) => {
  const { results, isLoading } = usePaginatedQuery(
    api.generations.page,
    {},
    { initialNumItems: 10 },
  )

  return (
    <ScrollArea>
      <div className="space-y-rx-8 overflow-y-auto py-rx-8">
        {results?.map((gen) => <Generation key={gen.generation._id} {...gen} />)}
        {isLoading && <Card className="mx-auto w-fit">Loading</Card>}
        {!isLoading && !results?.length && (
          <Card className="mx-auto w-fit">There is nothing here.</Card>
        )}
      </div>
    </ScrollArea>
  )
}
