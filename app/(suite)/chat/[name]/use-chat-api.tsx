import { useLocalGuestAuth } from '@/components/chat/use-local-guest-auth'
import { useToast } from '@/components/ui/use-toast'
import { getAvailableChatModels } from '@/lib/api'
import { raise } from '@/lib/utils'
import { useChat } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { ChatTabData } from './types'

const endpoint = '/api/chat'

export type ChatHelpers = ReturnType<typeof useChatApi>

export function useChatApi(chat: ChatTabData) {
  const { toast } = useToast()
  const models = getAvailableChatModels()
  const modelData =
    models.find((m) => m.id === chat.modelId) ?? raise(`unknown model id ${chat.modelId}`)

  const systemPrompt = `You are a helpful and cheerful AI assistant named ${chat.name}. Use Markdown in your answers when appropriate.`

  const token = useLocalGuestAuth('e/suite-guest-auth-token', '')

  const useChatHelpers = useChat({
    id: chat.id,
    api: endpoint,
    initialMessages: [createMessage('system', systemPrompt)],
    body: { ...chat.parameters, provider: modelData.provider, model: modelData.parameters.model },
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
  })

  const resetMessages = () => useChatHelpers.setMessages([createMessage('system', systemPrompt)])

  const addMessage = (role: Roles, content: string) => {
    chatHelpers.setMessages([...useChatHelpers.messages, createMessage(role, content)])
  }

  const chatHelpers = { ...useChatHelpers, resetMessages, addMessage }

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
