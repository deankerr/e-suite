import { EChatRequestSchema } from '@/lib/api/schemas'
import { validateJsonRecord } from '@/lib/validators'
import { Agent, Engine } from '@prisma/client'
import { useChat, UseChatOptions } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { toast } from 'sonner'

const endpoint = '/api/chat'

export function useAgentChat(chatId: string, agent: (Agent & { engine: Engine }) | null) {
  const initialMessages = agent
    ? [
        {
          id: nanoid(5),
          role: `system` as const,
          content: `You are an AI assistant named ${agent.name}.`,
        },
      ]
    : []

  const include = validateJsonRecord(agent?.engine?.includeParameters ?? {})

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

  const submitUserMessage = (content: string) => {
    chat.append({ role: 'user', content })
  }

  return { ...chat, submitUserMessage }
}
