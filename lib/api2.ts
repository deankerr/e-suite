import { useEffect } from 'react'
import { useMutation, usePaginatedQuery, usePreloadedQuery } from 'convex/react'
import { useAtom, useAtomValue } from 'jotai'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { activeThreadAtom } from '@/lib/atoms'

import type { Id } from '@/convex/_generated/dataModel'
import type { Preloaded } from 'convex/react'

export const useLatestThread = (preloadedThread: Preloaded<typeof api.ext.threads.getLatest>) => {
  const latest = usePreloadedQuery(preloadedThread)
  const [thread, set] = useAtom(activeThreadAtom)

  useEffect(() => {
    if (thread) return
    set(latest?.thread ?? null)
  }, [latest?.thread, set, thread])

  return latest
}

export const useThread = () => {
  const thread = useAtomValue(activeThreadAtom)
  return thread
}

export const useMessages = () => {
  const thread = useAtomValue(activeThreadAtom)
  const messages = usePaginatedQuery(
    api.ext.threads.messages,
    thread ? { threadId: thread._id } : 'skip',
    { initialNumItems: 8 },
  )
  return messages
}

export const useThreads = () => {
  const threads = usePaginatedQuery(api.ext.threads.list, {}, { initialNumItems: 20 })
  return threads
}

export const useThreadMutations = () => {
  const create = useMutation(api.threads.create)
  const remove = useMutation(api.threads.remove)

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
    remove: (threadId: Id<'threads'>) => {
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
  }

  return mutations
}
