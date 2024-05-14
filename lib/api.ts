import { useEffect } from 'react'
import { useMutation, usePreloadedQuery, useQuery } from 'convex/react'
import { useAtom, useAtomValue } from 'jotai'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { activeThreadIdAtom } from '@/lib/atoms'

import type { Preloaded } from 'convex/react'

export const usePreloadedThreads = (
  preloadedThreads: Preloaded<typeof api.threadsx.listThreads>,
) => {
  const [activeThreadId, setActiveThreadId] = useAtom(activeThreadIdAtom)
  const threads = usePreloadedQuery(preloadedThreads)

  const latestId = threads?.[0]?._id

  useEffect(() => {
    if (activeThreadId === '' && latestId) {
      setActiveThreadId(latestId)
    }
  }, [activeThreadId, latestId, setActiveThreadId])

  return { threads, activeThreadId: activeThreadId ?? latestId, setActiveThreadId }
}

export const useThreads = () => {
  const threads = useQuery(api.threadsx.listThreads, {})
  return threads
}

export const useActiveThread = () => {
  const id = useAtomValue(activeThreadIdAtom)
  const thread = useQuery(api.threadsx.getThread, { threadId: id })

  return thread
}

export const useThreadMutations = () => {
  const create = useMutation(api.threadsx.createThread)
  const remove = useMutation(api.threadsx.removeThread)
  const rename = useMutation(api.threadsx.renameThread)

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

export const useImageModelList = () => useQuery(api.models.listImageModels, {})
export const useChatModelList = () => useQuery(api.models.listChatModels, {})
