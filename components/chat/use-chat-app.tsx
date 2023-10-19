'use-client'

import { useToast } from '@/components/ui/use-toast'
import { raise } from '@/lib/utils'
import { useChat, type Message } from 'ai/react'
import { customAlphabet } from 'nanoid/non-secure'
import { useState } from 'react'
import type { ChatMessage, ChatSession } from './types'

type useChatAppConfig = ChatSession

const numId = customAlphabet('0123456789', 3)
// Hidden initial system prompt
const rootPrompt = 'Format your answers using Markdown.'

export function useChatApp(config: useChatAppConfig, prompt: string) {
  const { id, api } = config

  //! temp modelId patch
  const [provider, model] = config.parameters.modelId.split('::')
  if (!(provider || model)) raise('invalid model')
  const parameters = { ...config.parameters, provider, model }

  //* create initial messages
  const [initialMessages] = useState<Message[]>(() => {
    const rootMessage = createMessage('system', rootPrompt, { id: `R00T${numId()}` })
    rootMessage.hidden = true

    const systemMessage = createMessage('system', prompt)

    console.log(
      'useChatApp',
      { id },
      { [rootMessage.id]: rootMessage.content },
      { [systemMessage.id]: systemMessage.content },
    )
    return [rootMessage, systemMessage]
  })

  const { toast } = useToast()

  const chatHelpers = useChat({
    id,
    api: api.endpoint,
    initialMessages: [...initialMessages],
    body: { ...parameters },
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
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const resetChatMessages = () => chatHelpers.setMessages([...initialMessages])

  return { ...chatHelpers, resetChatMessages }
}

type Role = Message['role']
type MessageOptional = Omit<Message, 'role' | 'content' | 'id'> &
  Partial<{ id: string; hidden: boolean }>

function createMessage(role: Role, content: string, others: MessageOptional = {}): ChatMessage {
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
