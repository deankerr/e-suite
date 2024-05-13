import { useMutation, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { useInputBarAtom } from '@/components/input-bar/atoms'
import { api } from '@/convex/_generated/api'

export const useSendMessage = () => {
  const [inputBar] = useInputBarAtom()
  const latest = useQuery(api.ext.threads.getLatest, {})

  const threadId = latest?.thread._id
  const send = useMutation(api.messages.create)

  const sendMessage = async () => {
    if (!threadId) return

    try {
      await send({
        threadId: threadId,
        message: {
          role: 'user',
          text: inputBar.prompt,
        },
        completions:
          inputBar.mode === 'chat'
            ? [
                {
                  model: inputBar.chatModel,
                },
              ]
            : undefined,
        generations:
          inputBar.mode === 'image'
            ? [
                {
                  model_id: inputBar.imageModel,
                  prompt: inputBar.prompt,
                  provider: inputBar.imageModel.startsWith('fal') ? 'fal' : 'sinkin',
                  endpoint: '',
                  size: 'square_hd',
                  width: 1024,
                  height: 1024,
                  n: 4,
                  entries: [],
                },
              ]
            : undefined,
      })

      toast.success('Message sent.')
    } catch (err) {
      console.error(err)
      toast.error('An error occurred')
    }
  }
  return sendMessage
}
