'use client'

import { api } from '@/convex/_generated/api'
import { Card, Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

export default function ImageModelProvidersPage() {
  const providers = useQuery(api.imageModelProviders.list)

  return (
    <div className="dark:bg-grid-dark relative grid overflow-auto [&_div]:col-start-1 [&_div]:row-start-1">
      <div>
        <Heading size="5">unlinked? imageModelProviders</Heading>
        {providers?.map((p) => (
          <Card key={p._id} className="h-96 w-96">
            <pre className="overflow-auto bg-gray-1">{JSON.stringify(p, null, 2)}</pre>
          </Card>
        ))}
      </div>
    </div>
  )
}
