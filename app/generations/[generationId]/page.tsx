'use client'

import { useGeneration } from '@/app/lib/api/generations'
import { GenerationCard } from '@/components/generations/GenerationCard'

import type { Id } from '@/convex/_generated/dataModel'

export default function Page({ params }: { params: { generationId: Id<'generations_v2'> } }) {
  const generation = useGeneration(params.generationId)

  return generation ? (
    <div className="w-full">
      <GenerationCard generation={generation} defaultOpen />
    </div>
  ) : null
}
