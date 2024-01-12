'use client'

import { Select } from '@/app/components/ui/Select'
import { api } from '@/convex/_generated/api'
import { Badge, Card, colorProp, Heading, TextArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'
import Link from 'next/link'
import z from 'zod'

const typeBadgeColor: Record<string, (typeof colorProp)['values'][number]> = {
  checkpoint: 'orange',
  lora: 'blue',
  unknown: 'grass',
}

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

                <Badge color={typeBadgeColor[model.type] ?? 'brown'}>{model.type}</Badge>
                <Badge color="bronze">{new Date(model._creationTime).toLocaleString()}</Badge>
                {model.civit_id ? (
                  <Link href={`https://civitai.com/models/${model.civit_id}`}>
                    <Badge>civitai</Badge>
                  </Link>
                ) : null}

                <div>
                  <Heading size="3">Description</Heading>
                  <TextArea className="h-48" defaultValue={model.description}></TextArea>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    base:
                    <Select
                      values={[['sd-1.5'], ['sdxl'], ['dall-e'], ['unknown']]}
                      defaultValue={model.base}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    nsfw:
                    <Select
                      values={[['safe'], ['low'], ['high'], ['x']]}
                      defaultValue={model.nsfw}
                    />
                  </div>
                  <div className="">tags: {model.tags}</div>
                  <div className="flex items-center gap-2">
                    hidden:
                    <Select values={[['true'], ['false']]} defaultValue={String(model.hidden)} />
                  </div>
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
