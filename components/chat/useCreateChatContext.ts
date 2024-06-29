import { useCallback } from 'react'
import { useMutation } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { useMessages, useThread } from '@/lib/queries'

export const useCreateChatContextApi = ({ slug }: { slug?: string }) => {
  const thread = useThread({ slug })
  const messages = useMessages({ threadId: thread?._id })

  const sendAppendMessage = useMutation(api.db.threads.append)
  const sendUpdateThread = useMutation(api.db.threads.update)

  // const sendCreateMessage = useMutation(api.db.messages.create)
  const sendUpdateMessage = useMutation(api.db.messages.update)
  const sendRemoveMessage = useMutation(api.db.messages.remove)

  const sendRemoveVoiceover = useMutation(api.db.voiceover.remove)

  const appendMessage = useCallback(
    async (args: Omit<Parameters<typeof sendAppendMessage>[0], 'threadId'>) => {
      if (!thread) return
      await sendAppendMessage({ ...args, threadId: thread._id })
    },
    [sendAppendMessage, thread],
  )

  const updateThread = useCallback(
    async (args: Omit<Parameters<typeof sendUpdateThread>[0], 'threadId'>['fields']) => {
      if (!thread) return
      await sendUpdateThread({ threadId: thread._id, fields: args })
    },
    [thread, sendUpdateThread],
  )

  const updateMessage = useCallback(
    async (args: Parameters<typeof sendUpdateMessage>[0]) => {
      await sendUpdateMessage(args)
    },
    [sendUpdateMessage],
  )

  const removeMessage = useCallback(
    async (args: Parameters<typeof sendRemoveMessage>[0]) => {
      await sendRemoveMessage(args)
    },
    [sendRemoveMessage],
  )

  const removeVoiceover = useCallback(
    async (args: Parameters<typeof sendRemoveVoiceover>[0]) => {
      await sendRemoveVoiceover(args)
    },
    [sendRemoveVoiceover],
  )

  return {
    thread,
    messages,
    appendMessage,
    updateThread,
    updateMessage,
    removeMessage,
    removeVoiceover,
  }
}
