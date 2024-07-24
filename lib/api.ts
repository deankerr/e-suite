import { useCallback, useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

export const useThreadActions = (threadId?: string) => {
  const [actionState, setActionState] = useState<'ready' | 'pending' | 'rateLimited'>('ready')

  const sendRun = useMutation(api.db.runcreate.run)
  const run = useCallback(
    async (args: Omit<Parameters<typeof sendRun>[0], 'threadId'>) => {
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

  return { run, append, state: actionState }
}
