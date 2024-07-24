import { useCallback, useState } from 'react'
import { useMutation } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { useMessagesList, useSeriesMessage, useThread } from '@/lib/queries'

import type { ChatCompletionConfig, TextToImageConfig } from '@/convex/types'

type ChatQueryFilters = {
  role?: 'user' | 'assistant'
  hasContent?: 'image' | 'audio'
}

export const useCreateChatContext = ({ slug, series }: { slug?: string; series?: string }) => {
  const thread = useThread({ slug })

  const isMessageSeriesQuery = !!series
  const seriesMessage = useSeriesMessage({ slug, series })

  const [queryFilters, setQueryFilters] = useState<ChatQueryFilters | undefined>(undefined)

  const page = useMessagesList({
    slugOrId: !isMessageSeriesQuery ? thread?.slug : undefined,
    filters: queryFilters,
  })

  const loadMoreMessages = useCallback(() => {
    if (page.status === 'CanLoadMore') {
      page.loadMore(50)
    }
  }, [page])

  const messages = page.results

  // * mutations
  const sendUpdateThread = useMutation(api.db.threads.update)
  const sendUpdateMessage = useMutation(api.db.messages.update)
  const sendRemoveMessage = useMutation(api.db.messages.remove)

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
    async (args: Omit<Parameters<typeof sendRemoveMessage>[0], 'apiKey'>) => {
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
    seriesMessage,
    isMessageSeriesQuery,
    loadMoreMessages,
    page,
    updateThread,
    updateMessage,
    removeMessage,
    setChatInferenceConfig,
    setImageInferenceConfig,
    queryFilters,
    setQueryFilters,
  }
}
