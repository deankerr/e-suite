import { useMutation, usePaginatedQuery, usePreloadedQuery, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

import type { ThreadIndex } from '@/lib/types'
import type { Preloaded } from 'convex/react'

export const usePreloadedThreads = (
  preloadedThreads: Preloaded<typeof api.threads.query.listThreads>,
) => {
  const threads = usePreloadedQuery(preloadedThreads)
  return threads
}

export const useThread = (keys: ThreadIndex['keys'] = ['', '', '']) => {
  const [threadKey, messageIndex, fileIndex] = keys
  const thread = useQuery(api.threads.query.getThread, threadKey ? { slug: threadKey } : 'skip')

  const messageByIndex = useQuery(
    api.threads.query.getMessage,
    threadKey && messageIndex ? { slug: threadKey, messageIndex } : 'skip',
  )

  const fileIndexN = Number(fileIndex) - 1
  const fileId =
    messageByIndex && !isNaN(fileIndexN) ? messageByIndex.files?.[fileIndexN]?.id : null
  const file = messageByIndex?.images?.find((image) => image._id === fileId)
  return { thread, message: messageByIndex, file }
}

export const useThreads = () => {
  const threads = useQuery(api.threads.query.listThreads, {})
  return threads
}

export const useCreateThread = () => useMutation(api.threads.mutate.createThread)

export const useThreadMutations = () => {
  const create = useMutation(api.threads.mutate.createThread)
  const remove = useMutation(api.threads.mutate.removeThread)
  const rename = useMutation(api.threads.mutate.renameThread)

  const mutations = {
    create: () => {
      const runCreate = async () => {
        try {
          await create({})
          toast.info('Thread created')
        } catch (err) {
          toast.error('Failed to create thread.')
          console.error(err)
        }
      }

      void runCreate()
    },

    remove: (slug: string) => {
      const runRemove = async () => {
        try {
          await remove({ slug })
          toast.info('Thread deleted.')
        } catch (err) {
          toast.error('Failed to delete thread.')
          console.error(err)
        }
      }

      void runRemove()
    },

    rename: (slug: string, title: string) => {
      const runRename = async () => {
        try {
          await rename({ slug, title })
        } catch (err) {
          console.error(err)
        }
      }

      void runRename()
    },
  }

  return mutations
}

export const useCreateMessage = () => useMutation(api.threads.mutate.createMessage)
export const useRemoveMessage = () => useMutation(api.threads.mutate.removeMessage)

export const usePageMessages = (slug: any) =>
  usePaginatedQuery(api.threads.query.pageMessages, slug, { initialNumItems: 8 })
export const useRecentMessages = (slug: any) => useQuery(api.threads.query.listRecentMessages, slug)

export const useImageModelList = () => useQuery(api.models.listImageModels, {})
export const useChatModelList = () => useQuery(api.models.listChatModels, {})
