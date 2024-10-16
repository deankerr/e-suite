'use client'

import { useGenerations } from '@/app/lib/api/generations'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { GenerationCard } from './GenerationCard'

export const Generations = () => {
  const generations = useGenerations()

  return (
    <ScrollArea>
      <div className="flex flex-col gap-2">
        {generations.results.map((gen) => (
          <GenerationCard key={gen._id} generation={gen} />
        ))}
      </div>
    </ScrollArea>
  )
}
