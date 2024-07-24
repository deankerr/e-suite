import { useCallback, useState } from 'react'
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

export const useThreadActions = (threadId?: string) => {
  const [actionState, setActionState] = useState<'ready' | 'pending' | 'rateLimited'>('ready')

  const sendRun = useMutation(api.db.runcreate.run)
  const run = useCallback(
    async (args: Omit<Parameters<typeof sendRun>[0], 'threadId'>) => {
      if (!threadId) throw new Error('threadId is required')
      setActionState('pending')
      try {
        console.log('run', args)
        const result = await sendRun({ ...args, threadId })

        setActionState('ready')
        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while trying to run the action.')

        setActionState('ready')
        return null
      }
    },
    [sendRun, threadId],
  )

  const sendAppend = useMutation(api.db.runcreate.append)
  const append = useCallback(
    async (args: Omit<Parameters<typeof sendAppend>[0], 'threadId'>) => {
      if (!threadId) throw new Error('threadId is required')
      setActionState('pending')
      try {
        console.log('append', args)
        const result = await sendAppend({ ...args, threadId })
        setActionState('ready')
        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while trying to append message.')
        setActionState('ready')
        return null
      }
    },
    [sendAppend, threadId],
  )

  return { run, append, actionState }
}
