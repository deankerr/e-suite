import { useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

export const useAppendMessage = (threadId = '') => {
  const sendAppendMessage = useMutation(api.db.threadsB.append)
  const [inputReadyState, setInputReadyState] = useState<'ready' | 'pending' | 'locked'>('ready')

  const appendMessage = async (args: Omit<Parameters<typeof sendAppendMessage>[0], 'threadId'>) => {
    try {
      setInputReadyState('pending')
      const result = await sendAppendMessage({ ...args, threadId })
      setInputReadyState('ready')
      return result
    } catch (err) {
      console.error(err)
      toast.error('An error occurred while trying to append a message.')
      setInputReadyState('ready')
      return null
    }
  }

  return { appendMessage, inputReadyState }
}
