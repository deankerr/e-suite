'use client'

import { ImageModelCard } from '@/app/components/ui/ImageModelCard'
import { api } from '@/convex/_generated/api'
import { Button, Card, Inset, ScrollArea, Table } from '@radix-ui/themes'
import { useAction, useQuery } from 'convex/react'
import { useState } from 'react'
import { ImageId } from '../ui/ImageId'
import { Shell } from './Shell'

type ApiListView = {
  props?: any
}

type SinkinModelListing = typeof api.providers.sinkin.getModelsApi._returnType

export const ApiListView = ({ props }: ApiListView) => {
  const action = useAction(api.providers.sinkin.getModelsApi)
  const [result, setResult] = useState<SinkinModelListing | null>(null)

  return (
    <Shell.Root>
      <Shell.TitleBar>API</Shell.TitleBar>
      <Shell.Controls>
        <Button
          onClick={() => {
            action()
              .then((res) => setResult(res))
              .catch((err) => console.error(err))
          }}
        >
          Load
        </Button>
      </Shell.Controls>

      <Shell.Content className="col-span-2">
        <ScrollArea>
          {result && (
            <div className="grid gap-2">
              {result.models.map((model) => (
                <FakeImageModel key={model.id} data={model} className="h-36 w-80" />
              ))}
            </div>
          )}
        </ScrollArea>
      </Shell.Content>
    </Shell.Root>
  )
}

const FakeImageModel = ({
  data,
  ...props
}: { data: SinkinModelListing['models'][number] } & React.ComponentProps<typeof Card>) => {
  return (
    <Card {...props}>
      <div className="grid grid-cols-[minmax(auto,40%)_1fr] gap-4">
        {data && (
          <Inset side="all" className="bg-blue-3 object-center">
            <img src={data.cover_img} />
          </Inset>
        )}
        <div>
          <div className="text-sm">{data.name}</div>
          <div className="grid gap-1 divide-y text-xs text-gray-10">
            <div className="font-code">{data.id}</div>
            <div>civit: {data.civitai_model_id}</div>
            <div>
              <a href={data.link}>{data.link}</a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
