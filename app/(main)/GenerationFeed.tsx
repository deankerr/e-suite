'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { GenerationCard } from '../components/GenerationCard'

type GenerationFeedProps = {
  props?: any
}

export const GenerationFeed = ({ props }: GenerationFeedProps) => {
  // const generations = useQuery(api.generations.list)
  return (
    <div className="content-area-inset-shadow flex flex-col items-center gap-8 overflow-y-auto px-4 py-6 pb-32">
      {/* {generations?.map((data: Record<string, any>, i) => (
        <GenerationCard key={i} imageUrls={data.results} model={data.model} prompt={data.prompt} />
      ))} */}
    </div>
  )
}
