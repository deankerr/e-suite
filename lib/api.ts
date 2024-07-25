import { useCallback, useEffect, useState } from 'react'
import { useTimeoutEffect } from '@react-hookz/web'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

import type { ChatQueryFilters } from '@/components/providers/chat-context'

const RUN_THROTTLE = 5000
const MAX_LATEST_MESSAGES = 32

export const useThreadActions = (threadId?: string) => {
  const [actionState, setActionState] = useState<'ready' | 'pending' | 'rateLimited'>('ready')

  const [_, reset] = useTimeoutEffect(() => {
    setActionState('ready')
  }, RUN_THROTTLE)

  const sendRun = useMutation(api.db.threads.run)
  const run = useCallback(
    async (args: Omit<Parameters<typeof sendRun>[0], 'threadId'>) => {
      if (actionState !== 'ready') {
        toast.error('Please wait before running the action again.')
        return
      }
      setActionState('pending')
      try {
        console.log('run', args)
        const result = await sendRun({ ...args, threadId })

        setActionState('rateLimited')
        reset()
        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while trying to run the action.')

        setActionState('ready')
        return null
      }
    },
    [actionState, sendRun, threadId, reset],
  )

  const sendAppend = useMutation(api.db.threads.append)
  const append = useCallback(
    async (args: Omit<Parameters<typeof sendAppend>[0], 'threadId'>) => {
      if (actionState !== 'ready') {
        toast.error('Please wait before running the action again.')
        return
      }
      setActionState('pending')
      try {
        console.log('append', args)
        const result = await sendAppend({ ...args, threadId })

        setActionState('rateLimited')
        reset()
        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while trying to append message.')

        setActionState('ready')
        return null
      }
    },
    [actionState, sendAppend, threadId, reset],
  )

  return { run, append, state: actionState }
}

export const useUpdateCurrentThreadModel = () => {
  return useMutation(api.db.threads.updateCurrentModel)
}

export const useLatestMessages = (slugOrId?: string) => {
  return useQuery(api.db.threads.latest, slugOrId ? { slugOrId } : 'skip')
}

export const useMessagesList = ({
  slugOrId,
  filters,
}: {
  slugOrId?: string
  filters?: ChatQueryFilters
}) => {
  const [startPaginatedQuery, setStartPaginatedQuery] = useState(false)

  const latestResult = useLatestMessages(slugOrId)

  const pagedResult = usePaginatedQuery(
    api.db.messages.list,
    startPaginatedQuery && slugOrId ? { slugOrId, filters } : 'skip',
    {
      initialNumItems: 64,
    },
  )

  const latestMessagesLength = latestResult?.length ?? 0
  useEffect(() => {
    if (startPaginatedQuery) return
    if (filters || latestMessagesLength >= MAX_LATEST_MESSAGES) setStartPaginatedQuery(true)
  }, [filters, latestMessagesLength, startPaginatedQuery])

  if (startPaginatedQuery && pagedResult.status !== 'LoadingFirstPage') {
    return pagedResult
  }

  return {
    results: latestResult ?? [],
    status: latestResult === undefined ? 'LoadingFirstPage' : 'Exhausted',
    isLoading: false,
    loadMore: () => setStartPaginatedQuery(true),
  }
}
