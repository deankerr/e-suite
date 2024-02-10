'use client'

import { ImageModelCard } from '@/app/components/generations/ImageModelCard'
import { CardLite } from '@/app/components/ui/CardLite'
import { api } from '@/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'

export default function ImageModelCardPage() {
  const { results } = usePaginatedQuery(api.imageModels.page, {}, { initialNumItems: 3 })

  return (
    <CardLite className="grid h-[80vh] w-[80vw] grid-cols-2 gap-3 place-self-center p-6">
      {results.map((result) => {
        return (
          <div key={result.imageModel._id} className="grid gap-1">
            <ImageModelCard from={result} />
          </div>
        )
      })}
    </CardLite>
  )
}
