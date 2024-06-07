import { useCallback } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

import type { EChatCompletionInference, ETextToImageInference } from '@/convex/shared/structures'

export const useChatApi = (threadId: string) => {
  const apiCreateMessages = useMutation(api.db.messages.create)

  const createMessages = useCallback(
    async (args: Omit<Parameters<typeof apiCreateMessages>[0], 'threadId'>) => {
      try {
        const result = await apiCreateMessages({ ...args, threadId })
        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while creating messages.')
      }
    },
    [apiCreateMessages, threadId],
  )

  const createMessage = useMutation(api.threads.mutate.createMessage)
  const sendChatMessage = useCallback(
    async (args: { content: string; inference: EChatCompletionInference }) => {
      console.log('sendChatMessage', args)
      try {
        await createMessage({
          threadId,
          message: { role: 'user', content: args.content },
        })
        await createMessage({
          threadId,
          message: { role: 'assistant', inference: args.inference },
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to send message.')
      }
    },
    [createMessage, threadId],
  )

  const sendTextToImageMessage = useCallback(
    async (args: { prompt: string; inference: ETextToImageInference }) => {
      console.log('sendTextToImageMessage', args)
      try {
        await createMessage({
          threadId,
          message: { role: 'assistant', inference: { ...args.inference, prompt: args.prompt } },
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to send message.')
      }
    },
    [createMessage, threadId],
  )

  return { sendChatMessage, sendTextToImageMessage, createMessages }
}
