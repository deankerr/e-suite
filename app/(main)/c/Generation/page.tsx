'use client'

import { Generation } from '@/app/components/Shell/Generation'
import { Shell } from '@/app/components/ui/Shell'
import { api } from '@/convex/_generated/api'
import { Button } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'

export default function Page() {
  const { results } = usePaginatedQuery(api.generations.page, {}, { initialNumItems: 1 })
  const g = results[0]
  if (!g) return <div>no generations?</div>
  return (
    <div className="grid items-center">
      <Generation {...g} />
    </div>
  )
}
