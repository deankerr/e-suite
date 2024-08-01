import { useCallback, useState } from 'react'
import { useTimeoutEffect } from '@react-hookz/web'
import { useQuery as useCacheQuery } from 'convex-helpers/react/cache/hooks'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

const RUN_THROTTLE = 2500
const INITIAL_MESSAGE_LIMIT = 32

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
export const useThreadsList = () => {
  const pathname = usePathname()
  const slug = pathname.startsWith(appConfig.chatUrl) ? pathname.split('/')[2] : undefined

  const userThreads = useQuery(api.db.threads.list, {}) ?? []
  const currentUserThread = userThreads?.find((thread) => thread.slug === slug)

  const currentThreadFromSlug = useQuery(
    api.db.threads.get,
    slug && !currentUserThread ? { slugOrId: slug } : 'skip',
  )

  const threads = [...userThreads]
  if (currentThreadFromSlug) {
    threads.push(currentThreadFromSlug)
  }

  return threads.sort((a, b) => b.updatedAtTime - a.updatedAtTime)
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

export const useLatestMessages = ({
  slugOrId,
  limit = INITIAL_MESSAGE_LIMIT,
  byMediaType,
}: {
  slugOrId?: string
  limit?: number
  byMediaType?: 'images' | 'audio'
}) => {
  const queryKey = slugOrId ? { slugOrId, limit, byMediaType } : 'skip'
  return useCacheQuery(api.db.threads.latestMessages, queryKey)
}

export const useMessagePages = ({
  slugOrId,
  byMediaType,
}: {
  slugOrId?: string
  byMediaType?: 'images' | 'audio'
}) => {
  const queryKey = slugOrId ? { slugOrId, byMediaType } : 'skip'
  return usePaginatedQuery(api.db.threads.listMessages, queryKey, {
    initialNumItems: INITIAL_MESSAGE_LIMIT * 2,
  })
}

export const useMessageBySeries = ({ slug, series }: { slug?: string; series?: string }) => {
  return useCacheQuery(
    api.db.threads.getMessage,
    slug ? { slugOrId: slug, series: Number(series) } : 'skip',
  )
}

export const useThreadMessages = (args: { slug?: string; byMediaType?: 'images' | 'audio' }) => {
  const [queryType, setQueryType] = useState<'latest' | 'pages'>('latest')
  const shouldUsePageQuery = queryType === 'pages' || args.byMediaType

  const pagesQueryKey =
    shouldUsePageQuery && args.slug
      ? {
          slugOrId: args.slug,
          byMediaType: args.byMediaType,
        }
      : 'skip'

  const { results: pagedMessages, ...pager } = usePaginatedQuery(
    api.db.threads.listMessages,
    pagesQueryKey,
    { initialNumItems: INITIAL_MESSAGE_LIMIT * 2 },
  )

  const latestQueryKey =
    !shouldUsePageQuery && args.slug
      ? {
          slugOrId: args.slug,
          limit: INITIAL_MESSAGE_LIMIT,
        }
      : 'skip'
  const latestMessages = useCacheQuery(api.db.threads.latestMessages, latestQueryKey) ?? []

  const messages = shouldUsePageQuery ? pagedMessages : latestMessages

  const loadMore = () => {
    if (queryType === 'latest') {
      setQueryType('pages')
    } else {
      pager.loadMore(INITIAL_MESSAGE_LIMIT)
    }
  }

  const status = shouldUsePageQuery
    ? pager.status
    : latestMessages.length >= INITIAL_MESSAGE_LIMIT
      ? 'CanLoadMore'
      : 'Exhausted'
  const isLoading = shouldUsePageQuery ? pager.isLoading : latestMessages === undefined

  return {
    messages,
    loadMore,
    status,
    isLoading,
  }
}
