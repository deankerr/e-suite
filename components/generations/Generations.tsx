'use client'

import { useGenerations } from '@/app/lib/api/generations'
import { Section } from '@/components/ui/Section'
import { GenerationCard } from './GenerationCard'

export const Generations = () => {
  const generations = useGenerations()

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
