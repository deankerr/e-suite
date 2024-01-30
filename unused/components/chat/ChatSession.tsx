'use client'

import { ModelSelectBox } from '@/components/ModelSelect/ModelSelectBox'
import { Model, Resource } from '@/data/types'
import { Badge, Flex } from '@radix-ui/themes'
import { useState } from 'react'
import { ChatBuffer } from './ChatBuffer'
import { ChatInput } from './ChatInput'
import { useChat } from './useChat'

const defaultResourceId = 'openrouter@openchat/openchat-7b'

type ChatSessionProps = {
  models: Model[]
  resources: Resource[]
}

export const ChatSession = ({ models, resources }: ChatSessionProps) => {
  const [resourceId, setResourceId] = useState(defaultResourceId)
  const resource = resources.find((r) => r.id === resourceId)
  const model = models.find((m) => m.id === resource?.modelAliasId)

  const setResource = (id: string) => {
    const resource = resources.find((r) => r.modelAliasId === id)
    setResourceId(resource?.id ?? '')
  }

  const chat = useChat({
    chatId: 'chat123',
    model: resourceId,
    stream: true,
    stream_tokens: true,
  })

  return (
    <>
      <Flex p="2" gap="2" justify="center" align="center">
        <ModelSelectBox models={models} value={model} onValueChange={setResource} />
        <Badge className="h-fit">{resource?.vendor.displayName}</Badge>
      </Flex>
      <ChatBuffer messages={chat.messages} />
      <ChatInput chat={chat} />
    </>
  )
}
