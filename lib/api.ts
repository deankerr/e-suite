import { useCallback, useEffect, useState } from 'react'
import { useTimeoutEffect } from '@react-hookz/web'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

const RUN_THROTTLE = 2500
const MAX_LATEST_MESSAGES = 32

// * mutations
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

export const useMessageMutations = () => {
  const sendRemoveMessage = useMutation(api.db.messages.remove)

  const removeMessage = useCallback(
    async (args: Omit<Parameters<typeof sendRemoveMessage>[0], 'apiKey'>) => {
      await sendRemoveMessage(args)
    },
    [sendRemoveMessage],
  )

  return { removeMessage }
}

// * queries
export const useLatestMessages = (slugOrId?: string) => {
  return useQuery(api.db.threads.latest, slugOrId ? { slugOrId } : 'skip')
}

export const useMessagesList = ({ slugOrId, filters }: { slugOrId?: string; filters?: any }) => {
  const [startPaginatedQuery, setStartPaginatedQuery] = useState(false)

  const latestResult = useLatestMessages(slugOrId)

  const pagedResult = usePaginatedQuery(
    api.db.messages.list,
    startPaginatedQuery && slugOrId ? { slugOrId, filters } : 'skip',
    {
      initialNumItems: 64,
    },
  )

  useEffect(() => {
    if (startPaginatedQuery) return
    if (filters) setStartPaginatedQuery(true)
  }, [filters, startPaginatedQuery])

  if (startPaginatedQuery && pagedResult.status !== 'LoadingFirstPage') {
    return pagedResult
  }

  const latestMessagesLength = latestResult?.length ?? 0
  return {
    results: latestResult ?? [],
    status:
      latestResult === undefined
        ? 'LoadingFirstPage'
        : latestMessagesLength >= MAX_LATEST_MESSAGES
          ? 'CanLoadMore'
          : 'Exhausted',
    isLoading: false,
    loadMore: () => setStartPaginatedQuery(true),
  }
}

export const useViewer = () => {
  return useQuery(api.users.getViewer, {})
}

export const useThreads = (threadSlug?: string) => {
  const userThreads = useQuery(api.db.threads.list, {})
  const currentUserThread = userThreads?.find((thread) => thread.slug === threadSlug)

  const threadFromSlug = useQuery(
    api.db.threads.get,
    threadSlug && !currentUserThread ? { slugOrId: threadSlug } : 'skip',
  )

  return {
    userThreads,
    thread: currentUserThread ?? threadFromSlug,
  }
}

export const useSeriesMessage = ({ slug, series }: { slug?: string; series?: string }) => {
  return useQuery(
    api.db.messages.getSeriesMessage,
    slug && series ? { slug, series: Number(series) } : 'skip',
  )
}
