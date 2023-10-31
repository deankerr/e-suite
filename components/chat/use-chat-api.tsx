import { useLocalGuestAuth } from '@/components/chat/use-local-guest-auth'
import { useToast } from '@/components/ui/use-toast'
import { getEngineById } from '@/lib/api/engines'
import { EChatEngine, EChatRequestSchema } from '@/lib/api/schemas'
import { useChat, UseChatOptions } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { ChatSession, EngineInput } from './types'

const endpoint = '/api/chat'

export type ChatHelpers = ReturnType<typeof useChatApi>

export function useChatApi(session: ChatSession, engine: EChatEngine) {
  const { toast } = useToast()

  const token = useLocalGuestAuth('e/suite-guest-auth-token', '')
  const systemPrompt = `You are a helpful and cheerful AI assistant named ${session.name}. Use Markdown in your answers when appropriate.`

  const engineInput = session.engineInput[engine.id]

  const body: EChatRequestSchema = {
    engineId: engine.id,
    ...engine.input,
  }

  if (engineInput) {
    const fieldsEnabled = engineInput.fieldsEnabled

    for (const field of fieldsEnabled) {
      if (!(field in engineInput)) continue
      const key = field as keyof typeof engineInput
      Object.assign(body, { [key]: engineInput[key] })
    }
  }

  const requestConfig: UseChatOptions = {
    id: session.id,
    api: endpoint,
    initialMessages: [createMessage('system', systemPrompt)],
    headers: {
      Authorization: token,
    },
    body,
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

  const submitMessage = (role: Roles, content: string) => {
    console.log('body', body)
    useChatHelpers.append({ role, content })
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
