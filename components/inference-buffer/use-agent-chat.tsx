import { Agent } from '@/data/types'
import { stringToJsonSchema } from '@/schema/stringToJson'
import { useChat } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { toast } from 'sonner'
import z from 'zod'

// const endpoint = '/api/chat'
const endpoint = '/api/v1/chat/completions'

export function useAgentChat(chatId: string, agent: Agent) {
  const body: Record<string, unknown> = {
    ...agent.resourceParameters[agent.resourceId],
    model: agent.resource.endpointModelId,
    resourceId: agent.resourceId,
    vendorId: agent.resource.vendorId,
    stream: true,
    stream_tokens: true,
  }

  const chat = useChat({
    id: chatId,
    api: endpoint,
    body,
    initialMessages: createInitialMessages(agent.name),
    onResponse: (response) => {
      console.log('[response]', response)
    },
    onFinish: (message) => {
      console.log('[finish]', message)
    },
    onError: (error) => {
      const appError = parseAppErrorJson(error)
      if (appError) {
        toast.error(appError.message)
        console.error(appError)
      } else {
        toast.error(error.message)
        console.error(error)
      }
    },
  })

  const streamingMessageId =
    chat.isLoading && chat.messages.at(-1)?.role === 'assistant'
      ? chat.messages.at(-1)?.id
      : undefined

  const submitUserMessage = (content: string) => {
    console.log(body)
    chat.append({ role: 'user', content })
  }

  const resetMessages = () => chat.setMessages(createInitialMessages(agent.name))

  return { ...chat, submitUserMessage, resetMessages, streamingMessageId }
}

export type AgentChatHelpers = ReturnType<typeof useAgentChat>

function createInitialMessages(name: string) {
  return [
    {
      id: nanoid(7),
      role: `system` as const,
      content: `You are an AI assistant named ${name}.`,
    },
  ]
}

export function parseAppErrorJson(err: Error) {
  try {
    const isJson = stringToJsonSchema.parse(err.message)
    const appErr = z
      .object({
        code: z.string(),
        message: z.string(),
        debug: z.any(),
        name: z.string().optional(),
      })
      .parse(isJson)
    return appErr
  } catch (err) {
    return undefined
  }
}
