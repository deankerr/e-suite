import { useCallback } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

export const useChatApi = (threadId: string, slug: string) => {
  const apiUpdateThread = useMutation(api.db.threads.update).withOptimisticUpdate(
    (localStore, args) => {
      const currentValue = localStore.getQuery(api.db.threads.get, {
        slugOrId: slug,
      })
      if (currentValue) {
        localStore.setQuery(api.db.threads.get, { slugOrId: slug }, { ...currentValue, ...args })
      }
    },
  )

  const apiCreateMessage = useMutation(api.db.messages.create)

  const createMessage = useCallback(
    async (args: Omit<Parameters<typeof apiCreateMessage>[0], 'threadId'>) => {
      try {
        const result = await apiCreateMessage({ ...args, threadId })
        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while creating messages.')
      }
    },
    [apiCreateMessage, threadId],
  )

  const updateThread = useCallback(
    async (args: Omit<Parameters<typeof apiUpdateThread>[0], 'threadId'>) => {
      try {
        const result = await apiUpdateThread({ ...args, threadId })
        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while updating thread.')
      }
    },
    [apiUpdateThread, threadId],
  )

  return { createMessage, updateThread }
}
