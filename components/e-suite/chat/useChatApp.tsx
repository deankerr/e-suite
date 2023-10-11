'use-client'

import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { useState } from 'react'

type useChatAppConfig = {
  chatSessionId: string
  api: string
  prompt: string
  userName?: string
} & ChatModelConfig

type ChatModelConfig = {
  model: string
  provider: string
  stream: boolean
}

const numId = customAlphabet('0123456789')
// Won't be revealed to users
const rootPrompt = 'Use Markdown in your answers.'
const rootMessage = createMessage('system', rootPrompt, { id: `R00T${numId(3)}` })

export function useChatApp(config: useChatAppConfig) {
  const { chatSessionId, api, prompt, userName, model, provider, stream } = config

  //* set up
  const [initialMessages] = useState<Message[]>(() => {
    // TODO initialise with prior convo history
    const systemMessage = createMessage('system', prompt)

    console.log(
      'useChatApp',
      { id: chatSessionId },
      { [rootMessage.id]: rootMessage.content },
      { [systemMessage.id]: systemMessage.content },
    )
    return [rootMessage, systemMessage]
  })

  const chatHelpers = useChat({
    id: chatSessionId,
    api,
    initialMessages: [...initialMessages],
    body: {
      model,
      provider,
      stream,
    },
    headers: {
      pirce: 'yes sir',
    },
    onResponse: (response) => {
      console.log('[response]', response)
    },
    onFinish: (message) => {
      console.log('[finish]', message)
    },
    onError: (error) => {
      console.error('[error]', error)
    },
  })

  return chatHelpers
}

type Role = Message['role']
type MessageOptional = Omit<Message, 'role' | 'content' | 'id'> & { id?: string }

function createMessage(role: Role, content: string, others: MessageOptional = {}): Message {
  const { id, createdAt, function_call, name } = others
  const message = {
    role,
    content,
    function_call,
    name,
    id: id ?? nanoid(),
    createdAt: createdAt ?? new Date(),
  }
  return message
}

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7)
