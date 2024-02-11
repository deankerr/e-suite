'use client'

import { Generation } from '@/app/components/generations/Generation'
import { Spinner } from '@/app/components/ui/Spinner'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

export default function GenerationIdPage({ params }: { params: { id: Id<'generations'> } }) {
  const generation = useQuery(api.generations.get, { id: params.id })

  if (generation === undefined) return <Spinner />
  if (generation === null) return <div>Generation not found :-(</div>

  return (
    <ScrollArea>
      <Generation {...generation} />
    </ScrollArea>
  )
}
