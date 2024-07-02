import { useCallback, useEffect, useRef } from 'react'
import { useMutation } from 'convex/react'
import { useAtomValue, useSetAtom } from 'jotai'

import { api } from '@/convex/_generated/api'
import { voiceoverAutoplayThreadIdAtom, voiceoverQueueAtom } from '@/lib/atoms'
import { usePaginatedMessages, useThread } from '@/lib/queries'

export const useCreateChatContextApi = ({ slug }: { slug?: string }) => {
  const thread = useThread({ slug })

  const page = usePaginatedMessages({
    threadId: thread?._id,
  })
  const messages = page.results

  const latestMessageId = useRef('')
  const shouldAutoplayVoiceovers = useAtomValue(voiceoverAutoplayThreadIdAtom) === thread?._id
  const setVoiceoverQueue = useSetAtom(voiceoverQueueAtom)

  useEffect(() => {
    const newLatestMessage = messages?.at(0)
    if (!latestMessageId.current) {
      latestMessageId.current = newLatestMessage?._id ?? ''
    }
    if (!messages || !newLatestMessage) return

    const newMessages = messages
      .slice(
        0,
        messages.findIndex((message) => message._id === latestMessageId.current),
      )
      .reverse()

    if (shouldAutoplayVoiceovers) {
      setVoiceoverQueue((prev) => [
        ...prev,
        ...newMessages.map(({ _id }) => _id).filter((id) => !prev.includes(id)),
      ])
    }

    latestMessageId.current = newLatestMessage._id
  }, [messages, setVoiceoverQueue, shouldAutoplayVoiceovers])

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
    page,
    appendMessage,
    updateThread,
    updateMessage,
    removeMessage,
    removeVoiceover,
  }
}
