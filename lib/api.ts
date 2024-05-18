import { useMutation, usePaginatedQuery, usePreloadedQuery, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { useRouteIndex } from '@/lib/hooks'

import type { ThreadIndex } from '@/lib/types'
import type { Preloaded } from 'convex/react'

export const usePreloadedThreads = (
  preloadedThreads: Preloaded<typeof api.threads.query.listThreads>,
) => {
  const threads = usePreloadedQuery(preloadedThreads)
  return threads
}

const emptyThreadIndex: ThreadIndex = { thread: '', message: '', file: '', keys: ['', '', ''] }

export const useThreadIndex = (index: ThreadIndex = emptyThreadIndex) => {
  const queryKey = index.thread ? { slug: index.thread } : 'skip'
  const thread = useQuery(api.threads.query.getThread, queryKey)

  const listMessagesQueryKey = index.thread && !index.message ? { slug: index.thread } : 'skip'
  const messages = usePaginatedQuery(api.threads.query.listMessages, listMessagesQueryKey, {
    initialNumItems: 8,
  })

  const getMessageSeriesQueryKey =
    index.thread && index.message ? { slug: index.thread, series: index.message } : 'skip'
  const series = useQuery(api.threads.query.getMessageSeries, getMessageSeriesQueryKey)

  const file = Number(index.file) ? Number(index.file) : undefined
  return { thread, messages, series, file }
}

export const useThread = (slug?: string) => {
  const routeIndex = useRouteIndex()
  const queryKey = slug ? { slug } : routeIndex.thread ? { slug: routeIndex.thread } : 'skip'
  const thread = useQuery(api.threads.query.getThread, queryKey)

  return thread
}

export const useThreads = () => {
  const threads = useQuery(api.threads.query.listThreads, {})
  return threads
}

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

export const useCreateThread = () => useMutation(api.threads.mutate.createThread)
export const useCreateMessage = () => useMutation(api.threads.mutate.createMessage)
export const useRemoveMessage = () => useMutation(api.threads.mutate.removeMessage)

export const useImageModelList = () => useQuery(api.models.listImageModels, {})
export const useChatModelList = () => useQuery(api.models.listChatModels, {})
