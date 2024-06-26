import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useQuery } from 'convex-helpers/react/cache/hooks'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from 'react-use'

import { api } from '@/convex/_generated/api'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'

import type { EMessage, EThread } from '@/convex/shared/types'

const useThreadQuery = ({ slug = '' }: { slug?: string }): EThread | null | undefined => {
  const thread = useQuery(api.db.threads.get, {
    slugOrId: slug,
  })

  return useMemo(() => {
    return thread
  }, [thread])
}

const useMessagesQuery = ({ threadId = '' }: { threadId?: string }): EMessage[] | undefined => {
  const messages = useQuery(api.db.messages.list, {
    threadId,
    limit: 25,
  })

  return useMemo(() => {
    return messages
  }, [messages])
}

export const useCreateChatContextApi = ({ slug }: { slug?: string }) => {
  const thread = useThreadQuery({ slug })
  const messages = useMessagesQuery({ threadId: thread?._id })

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

  return {
    thread,
    messages,
    appendMessage,
    updateThread,
    updateMessage,
    removeMessage,
  }
}
