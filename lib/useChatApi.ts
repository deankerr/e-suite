import { useCallback } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

export const useChatApi = (threadId: string) => {
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

  return { createMessage }
}
