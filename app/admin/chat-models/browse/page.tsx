'use client'

import { Badge, Card, Heading } from '@radix-ui/themes'
import { useQuery } from 'convex-helpers/react'
import { useTitle } from 'react-use'

import { api } from '@/convex/_generated/api'

import type { EChatModel } from '@/convex/shared/shape'
import type { ButtonProps } from '@radix-ui/themes'

export default function Page() {
  useTitle('admin - chat models - browse')
  const models = useQuery(api.db.chatModels.list, {})
  return (
    <div className="">
      <div className="grid grid-cols-3 gap-3">
        {models.data?.map((model) => <ChatModelCard key={model._id} model={model} />)}
      </div>
    </div>
  )
}

const ChatModelCard = ({ model }: { model: EChatModel }) => {
  return (
    <Card className="space-y-2">
      <div className="">
        <Heading size="2">{model.name}</Heading>
        <Heading size="1">{model.creatorName}</Heading>
        <div className="font-mono text-xs">{model.slug}</div>
        <div className="font-mono text-xs text-accent-11">
          {model.endpoints.map((e) => (
            <Badge key={e.endpoint} color={endpointColors[e.endpoint]}>
              {e.endpoint}
            </Badge>
          ))}
        </div>
      </div>
      <div className="line-clamp-4 text-sm">{model.description}</div>
    </Card>
  )
}

const endpointColors: Record<string, ButtonProps['color']> = {
  openrouter: 'red',
  openai: 'green',
  together: 'iris',
}
