import { Agent, AgentDetail } from '@/schema/user'
import { Message } from 'ai'
import { useChat } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { toast } from 'sonner'

const endpoint = '/api/chat'

export function useAgentChat(chatId: string, agent: AgentDetail) {
  const body: Record<string, unknown> = {
    ...agent.parameters[agent.engineId],
    model: agent.engine.providerModelId,
    engineId: agent.engineId,
    stream: true,
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
      console.error('[error]', error)
      toast.error(error.message)
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
