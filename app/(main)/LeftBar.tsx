'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ImageModel } from '@/convex/types'
import { Button, Card, ScrollArea, Separator } from '@radix-ui/themes'
import { usePaginatedQuery } from 'convex/react'
import { useState } from 'react'
import { ImageModelCard } from '../components/ImageModelCard'
import { Sidebar } from '../components/Sidebar'

type LeftBarProps = {
  props?: any
}

// has-[:hover]:left-0 md:left-0
export const LeftBar = ({ props }: LeftBarProps) => {
  return (
    <Sidebar side="left" className="overflow-clip px-4">
      <SelectImageModel />
    </Sidebar>
  )
}

type SelectImageModelProps = {
  props?: any
}

export const SelectImageModel = ({ props }: SelectImageModelProps) => {
  const [selectedModelId, setSelectedModelId] = useState<Id<'imageModels'>>()
  const [selectedModel, setSelectedModel] = useState<ImageModel>()

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.imageModels.page,
    {},
    { initialNumItems: 10 },
  )

  return (
    <>
      <div className="text-[10px]">selectedModelId: {selectedModelId}</div>

      {selectedModel ? (
        <ImageModelCard imageModel={selectedModel} />
      ) : (
        <Card className="h-36 flex-none">select a model :)</Card>
      )}

      <Separator className="w-full" />

      <ScrollArea className="h-full bg-gray-1">
        <div className="font-code text-[8px]">
          status: {status} | isLoading: {String(isLoading)}
        </div>

        <div className="space-y-4">
          {results.map((m) => (
            <ImageModelCard
              key={m._id}
              imageModel={m}
              className="cursor-pointer"
              onClick={() => {
                setSelectedModelId(m._id)
                setSelectedModel(m)
              }}
            />
          ))}
          <Button onClick={() => loadMore(10)}>Load more</Button>
        </div>
      </ScrollArea>
    </>
  )
}
