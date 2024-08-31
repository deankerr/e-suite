'use client'

import { useQuery } from 'convex/react'

import { GenerationCard } from '@/app/generate-demo/GenerationCard'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

export default function Page({ params }: { params: { genId: Id<'generations_v2'> } }) {
  const generation = useQuery(api.db.generations.getV2, {
    generationId: params.genId,
  })

  return generation ? (
    <div className="w-full">
      <GenerationCard generation={generation} defaultOpen />
    </div>
  ) : null
}
