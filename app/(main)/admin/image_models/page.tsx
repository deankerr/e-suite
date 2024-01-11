'use client'

import { api } from '@/convex/_generated/api'
import { Card, Heading, TextArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'
import z from 'zod'

export default function ImageModelsPage() {
  const imageModels = useQuery(api.image_models.list)
  return (
    <div className="dark:bg-grid-dark relative grid overflow-auto [&_div]:col-start-1 [&_div]:row-start-1">
      <div className="space-y-4 p-6">
        {imageModels?.map((model) => {
          return (
            <Card key={model._id} className="max-w-md">
              <div className="space-y-2">
                <div className="font-mono text-xs text-gray-8">{model._id}</div>
                <Heading>{model.name}</Heading>
                <div className="text-sm">
                  {model.type} {new Date(model._creationTime).toLocaleString()}
                </div>

                <div>
                  <Heading size="3">Description</Heading>
                  <TextArea className="h-48" defaultValue={model.description}></TextArea>
                </div>
                <div>
                  <div>base: {model.base}</div>
                  <div>nsfw: {model.nsfw}</div>
                  <div className="">tags: {model.tags}</div>
                  <div>hidden: {model.hidden}</div>
                </div>

                <div>images</div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
