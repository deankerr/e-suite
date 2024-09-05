'use client'

import { useGenerations } from '@/app/lib/api/generations'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { GenerationCard } from './GenerationCard'

export const Generations = () => {
  const generations = useGenerations()

  return (
    <VScrollArea>
      <div className="flex flex-col gap-2">
        {generations.results.map((gen) => (
          <GenerationCard key={gen._id} generation={gen} />
        ))}
      </div>
    </VScrollArea>
  )
}
