'use client'

import { Shell } from '@/app/components/Shell/Shell'
import { ImageModelCard } from '@/app/components/ui/ImageModelCard'
import { api } from '@/convex/_generated/api'
import { Button, ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { useState } from 'react'

export default function AdminImageModelsPage() {
  const results = useQuery(api.imageModels.list, { type: 'checkpoint' })

  const byAlpha = results?.toSorted((a, b) => {
    const nameA = a.imageModel.name.toLowerCase()
    const nameB = b.imageModel.name.toLowerCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })

  const byOrder = results?.toSorted((a, b) => b.imageModel.order - a.imageModel.order)

  const [by, setBy] = useState<'alpha' | 'order'>('order')

  const resultsBy = by === 'alpha' ? byAlpha : byOrder
  return (
    <div className="grid h-lvh gap-4 p-4">
      <Shell.Root>
        <Shell.TitleBar>Search</Shell.TitleBar>
        <Shell.Controls>
          <Button onClick={() => setBy('order')}>order</Button>
          <Button onClick={() => setBy('alpha')}>alpha</Button>
        </Shell.Controls>
        <Shell.Content className="col-span-2 max-h-[90vh]">
          <ScrollArea className="">
            <div className="flex flex-wrap justify-center gap-2">
              {resultsBy?.map((result) => (
                <ImageModelCard key={result.imageModel._id} from={result} className="h-36 w-80" />
              ))}
            </div>
          </ScrollArea>
        </Shell.Content>
      </Shell.Root>
    </div>
  )
}
