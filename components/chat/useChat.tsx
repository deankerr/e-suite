'use client'

import { stringToJsonSchema } from '@/lib/zod'
import { useChat as useChatAi } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { toast } from 'sonner'
import z from 'zod'
import { sampleMessages } from './sample-data'

const endpoint = '/api/v1/chat/completions'

type UseChatConfig = {
  chatId: string
  name?: string
  model: string
} & Record<string, unknown>

export function useChat({ chatId, name = 'Turbo', ...body }: UseChatConfig) {
  const chat = useChatAi({
    id: chatId,
    api: endpoint,
    body,
    initialMessages: createInitialMessages(name),
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
    void chat.append({ role: 'user', content })
  }

  const resetMessages = () => chat.setMessages(createInitialMessages(name))

  return { ...chat, submitUserMessage, resetMessages, streamingMessageId }
}

export type UseChatHelpers = ReturnType<typeof useChat>

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
