import { schemaAgentParameters, schemaAgentParametersRecord } from '@/lib/schemas'
import { Agent, Engine } from '@prisma/client'
import { useChat } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { toast } from 'sonner'
import { useEngineQuery } from './queries'

const endpoint = '/api/chat'

export function useAgentChat(chatId: string, agent: Agent | undefined) {
  const engine = useEngineQuery(agent?.engineId)

  const initialMessages = agent
    ? [
        {
          id: nanoid(5),
          role: `system` as const,
          content: `You are an AI assistant named ${agent.name}.`,
        },
      ]
    : []

  // TODO parameters[engineid]
  // const include = schemaAgentParametersRecord.parse(agent?.parameters)
  const include = {}

  const chat = useChat({
    id: chatId,
    api: endpoint,
    body: agent
      ? {
          engineId: agent.engineId,
          ...include,
        }
      : {},
    initialMessages,
    onResponse: (response) => {
      console.log('[response]', response)
    },
    onFinish: (message) => {
      console.log('[finish]', message)
    },
    onError: (error) => {
      console.error('[error]', error)
      toast.error(error.message)
    },
  })

  const streamingId =
    chat.isLoading && chat.messages.at(-1)?.role === 'assistant'
      ? chat.messages.at(-1)?.id
      : undefined

  const submitUserMessage = (content: string) => {
    chat.append({ role: 'user', content })
  }

  return { ...chat, submitUserMessage, streamingId }
}
