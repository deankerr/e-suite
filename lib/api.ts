import { useMutation, usePreloadedQuery, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

import type { Preloaded } from 'convex/react'

export const usePreloadedThreads = (
  preloadedThreads: Preloaded<typeof api.threads.query.listThreads>,
) => {
  const threads = usePreloadedQuery(preloadedThreads)
  return threads
}

export const useThread = (slug?: string) => {
  const thread = useQuery(api.threads.query.getThread, slug ? { threadId: slug } : 'skip')
  return thread
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

export const useImageModelList = () => useQuery(api.models.listImageModels, {})
export const useChatModelList = () => useQuery(api.models.listChatModels, {})
