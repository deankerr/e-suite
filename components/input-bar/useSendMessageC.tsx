import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useInputBarAtom } from '@/components/input-bar/atoms'
import { useCreateMessage, useCreateThread } from '@/lib/api'
import { useRouteData } from '@/lib/hooks'

export const useSendMessageC = () => {
  const [inputBar] = useInputBarAtom()

  const sendCreateThread = useCreateThread()
  const sendCreateMessage = useCreateMessage()
  const router = useRouter()
  const route = useRouteData()

  const sendMessage = async () => {
    try {
      const threadId = route.thread ?? (await sendCreateThread({}))
      const inference =
        inputBar.mode === 'chat'
          ? {
              type: 'chat-completion' as const,
              endpoint: 'together',
              parameters: {
                model: inputBar.chatModel,
              },
            }
          : undefined

      await sendCreateMessage({
        threadId,
        message: { role: 'user', content: inputBar.prompt },
        inference,
      })

      if (route.thread !== threadId) router.replace(`/t/${threadId}`)
    } catch (err) {
      toast.error('An error occurred')
      console.error(err)
    }
  }

  return sendMessage
}
