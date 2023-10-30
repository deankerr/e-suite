import { useLocalGuestAuth } from '@/components/chat/use-local-guest-auth'
import { useToast } from '@/components/ui/use-toast'
import { getEngineById } from '@/lib/api/engines'
import { EChatRequestSchema } from '@/lib/api/schema'
import { useChat, UseChatOptions } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { ChatSession, EngineInput } from './types'

const endpoint = '/api/chat'

export type ChatHelpers = ReturnType<typeof useChatApi>

export function useChatApi(session: ChatSession) {
  const { toast } = useToast()

  const token = useLocalGuestAuth('e/suite-guest-auth-token', '')
  const systemPrompt = `You are a helpful and cheerful AI assistant named ${session.name}. Use Markdown in your answers when appropriate.`

  const createRequestBody = (engineId: string, input: EngineInput) => {
    const engine = getEngineById(engineId)

    const body: EChatRequestSchema = {
      engineId,
      ...engine?.input,
    }
    const { fieldsEnabled = [] } = input

    for (const field of fieldsEnabled) {
      if (!(field in input)) continue
      const key = field as keyof typeof input
      Object.assign(body, { [key]: input[key] })
    }
    console.log('body', body)
    return body
  }

  const requestConfig: UseChatOptions = {
    id: session.id,
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
    engineInput: { engineId: string; input: EngineInput },
  ) => {
    const { engineId, input } = engineInput
    const body = createRequestBody(engineId, input)
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
