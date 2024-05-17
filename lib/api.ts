import { useMutation, usePaginatedQuery, usePreloadedQuery, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { useRouteData } from '@/lib/hooks'

import type { Preloaded } from 'convex/react'

export const usePreloadedThreads = (
  preloadedThreads: Preloaded<typeof api.threads.query.listThreads>,
) => {
  const threads = usePreloadedQuery(preloadedThreads)
  return threads
}

export const useThread = (slug?: string) => {
  const route = useRouteData()
  const key = slug ?? route.thread
  const query = key ? { slug: key } : 'skip'
  const thread = useQuery(api.threads.query.getThread, query)
  return { thread, isLoading: thread === undefined && query !== 'skip', isError: thread === null }
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

    remove: (threadId: string) => {
      const runRemove = async () => {
        try {
          await remove({ threadId })
          toast.info('Thread deleted.')
        } catch (err) {
          toast.error('Failed to delete thread.')

          console.error(err)
        }
      }

      void runRemove()
    },

    rename: (threadId: string, title: string) => {
      const runRename = async () => {
        try {
          await rename({ threadId, title })
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

export const useMessages = (threadId: string) =>
  usePaginatedQuery(api.threads.query.listMessages, { threadId }, { initialNumItems: 8 })

export const useImageModelList = () => useQuery(api.models.listImageModels, {})
export const useChatModelList = () => useQuery(api.models.listChatModels, {})
