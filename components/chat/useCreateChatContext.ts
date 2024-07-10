import { useCallback, useEffect, useRef } from 'react'
import { useMutation } from 'convex/react'
import { useAtomValue, useSetAtom } from 'jotai'

import { api } from '@/convex/_generated/api'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { useChatState, voiceoverAutoplayThreadIdAtom, voiceoverQueueAtom } from '@/lib/atoms'
import { useMessagesList, useThread } from '@/lib/queries'

import type { ChatCompletionConfig, TextToImageConfig } from '@/convex/types'

export const useCreateChatContextApi = ({ slug }: { slug?: string }) => {
  const thread = useThread({ slug })

  const [chatState] = useChatState(slug ?? '')

  const page = useMessagesList({
    slugOrId: thread?.slug,
    filters: chatState.queryFilters,
  })

  const loadMoreMessages = useCallback(() => {
    page.loadMore(50)
  }, [page])

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

  // * mutations
  const sendAppendMessage = useMutation(api.db.threads.append)
  const sendUpdateThread = useMutation(api.db.threads.update)

  // const sendCreateMessage = useMutation(api.db.messages.create)
  const sendUpdateMessage = useMutation(api.db.messages.update)
  const sendRemoveMessage = useMutation(api.db.messages.remove)

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

  // * mutation helpers
  const setChatInferenceConfig = useCallback(
    (args: Partial<ChatCompletionConfig>) => {
      if (!thread) return
      const current =
        thread.inference.type === 'chat-completion' ? thread.inference : defaultChatInferenceConfig
      const updated = {
        ...current,
        ...args,
      }
      void updateThread({ inference: updated })
    },
    [thread, updateThread],
  )

  const setImageInferenceConfig = useCallback(
    (args: Partial<TextToImageConfig>) => {
      if (!thread) return
      const current =
        thread.inference.type === 'text-to-image' ? thread.inference : defaultImageInferenceConfig
      const updated = {
        ...current,
        ...args,
      }
      void updateThread({ inference: updated })
    },
    [thread, updateThread],
  )

  return {
    thread,
    messages,
    loadMoreMessages,
    page,
    appendMessage,
    updateThread,
    updateMessage,
    removeMessage,
    setChatInferenceConfig,
    setImageInferenceConfig,
  }
}
