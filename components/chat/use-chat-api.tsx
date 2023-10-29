import { useLocalGuestAuth } from '@/components/chat/use-local-guest-auth'
import { useToast } from '@/components/ui/use-toast'
import { getEngineById } from '@/lib/api/engines'
import { useChat, UseChatOptions } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { ChatSession, ChatSessionModelParameters } from './types'

const endpoint = '/api/chat'

export type ChatHelpers = ReturnType<typeof useChatApi>

export function useChatApi(chat: ChatSession) {
  const { toast } = useToast()

  const token = useLocalGuestAuth('e/suite-guest-auth-token', '')
  const systemPrompt = `You are a helpful and cheerful AI assistant named ${chat.name}. Use Markdown in your answers when appropriate.`

  const createModelParamsBody = (engineId: string, parameters: ChatSessionModelParameters) => {
    const engine = getEngineById(engineId)

    const body = {
      engineId,
      parameters: { ...engine?.parameters },
    }
    const { fieldsEnabled = [] } = parameters

    for (const field of fieldsEnabled) {
      if (!(field in parameters)) continue
      const key = field as keyof typeof parameters
      body.parameters[key] = parameters[key]
    }
    console.log('body', body)
    return body
  }

  const requestConfig: UseChatOptions = {
    id: chat.id,
    api: endpoint,
    initialMessages: [createMessage('system', systemPrompt)],
    headers: {
      Authorization: token,
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

  const submitMessage = (
    role: Roles,
    content: string,
    params: { engineId: string; parameters: ChatSessionModelParameters },
  ) => {
    const { engineId, parameters } = params
    const body = createModelParamsBody(engineId, parameters)
    useChatHelpers.append({ role, content }, { options: { body } })
  }

  const requestStatus: ChatRequestStatus = isLoading
    ? messages.at(-1)?.role === 'assistant'
      ? 'streaming'
      : 'waiting'
    : 'idle'

  const chatHelpers = { ...useChatHelpers, resetMessages, addMessage, requestStatus, submitMessage }
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
