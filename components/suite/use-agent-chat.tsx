import { useLocalGuestAuth } from '@/components/chat/use-local-guest-auth'
import { EChatRequestSchema } from '@/lib/api/schemas'
import { validateJsonRecord } from '@/lib/validators'
import { Engine } from '@prisma/client'
import { useChat, UseChatOptions } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { toast } from 'sonner'

const endpoint = '/api/chat'

export function useAgentChat({
  chatId,
  agentName,
  engineId,
}: {
  chatId: string
  agentName: string
  engineId: string
}) {
  const initialMessages = agentName
    ? [
        {
          id: nanoid(5),
          role: `system` as const,
          content: `You are an AI assistant named ${agentName}.`,
        },
      ]
    : []

  const chat = useChat({
    id: chatId,
    api: endpoint,
    body: {
      engineId,
    },
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
