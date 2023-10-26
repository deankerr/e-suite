import { useLocalGuestAuth } from '@/components/chat/use-local-guest-auth'
import { useToast } from '@/components/ui/use-toast'
import { getModelById } from '@/lib/api'
import { useChat, UseChatOptions } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { ChatTabData } from './types'

const endpoint = '/api/chat'

export type ChatHelpers = ReturnType<typeof useChatApi>

export function useChatApi(chat: ChatTabData) {
  const { toast } = useToast()

  const modelData = getModelById(chat.modelId)
  const token = useLocalGuestAuth('e/suite-guest-auth-token', '')
  const systemPrompt = `You are a helpful and cheerful AI assistant named ${chat.name}. Use Markdown in your answers when appropriate.`

  // construct request body
  const body: Record<string, unknown> = {}
  const { fieldsEnabled = [] } = chat.parameters
  for (const field of fieldsEnabled) {
    if (!(field in chat.parameters)) continue
    const key = field as keyof typeof chat.parameters
    body[key] = chat.parameters[key]
  }

  const requestConfig: UseChatOptions = {
    id: chat.id,
    api: endpoint,
    initialMessages: [createMessage('system', systemPrompt)],
    headers: {
      Authorization: token,
    },
    body: {
      ...body,
      provider: modelData.provider,
      stream: true,
      ...modelData.parameters,
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
  }

  // create chat
  const useChatHelpers = useChat(requestConfig)
  const { messages, setMessages, isLoading } = useChatHelpers
  // extra helpers
  const resetMessages = () => setMessages([createMessage('system', systemPrompt)])

  const addMessage = (role: Roles, content: string) => {
    chatHelpers.setMessages([...messages, createMessage(role, content)])
  }

  const requestStatus: ChatRequestStatus = isLoading
    ? messages.at(-1)?.role === 'assistant'
      ? 'streaming'
      : 'waiting'
    : 'idle'

  const chatHelpers = { ...useChatHelpers, resetMessages, addMessage, requestStatus }
  return chatHelpers
}

function createMessage(role: Roles, content: string) {
  return {
    role,
    content,
    id: `_${nanoid(6)}`,
  }
}

type Roles = 'system' | 'user' | 'assistant'
type ChatRequestStatus = 'streaming' | 'waiting' | 'idle'
