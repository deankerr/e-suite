import { useCallback } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

import type { EChatCompletionInference, ETextToImageInference } from '@/convex/shared/structures'

export const useChatApi = () => {
  const createMessage = useMutation(api.threads.mutate.createMessage)

  const sendChatMessage = useCallback(
    async (args: { threadId: string; content: string; inference: EChatCompletionInference }) => {
      console.log('sendChatMessage', args)
      try {
        await createMessage({
          threadId: args.threadId,
          message: { role: 'user', content: args.content },
        })
        await createMessage({
          threadId: args.threadId,
          message: { role: 'assistant', inference: args.inference },
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to send message.')
      }
    },
    [createMessage],
  )

  const sendTextToImageMessage = useCallback(
    async (args: { threadId: string; prompt: string; inference: ETextToImageInference }) => {
      console.log('sendTextToImageMessage', args)
      try {
        const inference = {
          ...args.inference,
          parameters: { ...args.inference.parameters, prompt: args.prompt },
        }
        await createMessage({ threadId: args.threadId, message: { role: 'assistant', inference } })
      } catch (err) {
        console.error(err)
        toast.error('Failed to send message.')
      }
    },
    [createMessage],
  )

  return { sendChatMessage, sendTextToImageMessage }
}
