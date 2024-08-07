import { useCallback, useMemo, useState } from 'react'
import { useTimeoutEffect } from '@react-hookz/web'
import { useQuery as useCacheQuery } from 'convex-helpers/react/cache/hooks'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { useAtomValue } from 'jotai'
import { toast } from 'sonner'

import { messageQueryAtom } from '@/components/providers/atoms'
import { api } from '@/convex/_generated/api'
import { useSuitePath } from '@/lib/helpers'

import type { EChatModel, EImageModel, EVoiceModel } from '@/convex/types'

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

export const useUpdateThread = () => {
  return useMutation(api.db.threads.update)
}

export const useDeleteThread = () => {
  return useMutation(api.db.threads.remove)
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
export const useThreads = (selectSlug?: string) => {
  const { slug } = useSuitePath()
  const selectedSlug = selectSlug ?? slug

  const userThreads = useQuery(api.db.threads.list, {})
  userThreads?.sort((a, b) => b.updatedAtTime - a.updatedAtTime)

  // * get the current thread from users list instantly if it's their thread
  const selectedUserThread = userThreads?.find((thread) => thread.slug === selectedSlug)
  // * otherwise fetch it individually
  const selectedThread = useQuery(
    api.db.threads.get,
    selectedSlug && !selectedUserThread ? { slugOrId: selectedSlug } : 'skip',
  )

  const threadsList = (selectedThread ? [selectedThread] : []).concat(userThreads ?? [])

  return {
    threadsList,
    thread: selectedUserThread ?? selectedThread,
  }
}

export const useLatestMessages = ({
  slugOrId,
  limit = INITIAL_MESSAGE_LIMIT,
}: {
  slugOrId?: string
  limit?: number
}) => {
  const queryFilters = useAtomValue(messageQueryAtom)
  const queryKey = slugOrId ? { slugOrId, limit, byMediaType: queryFilters.byMediaType } : 'skip'
  return useCacheQuery(api.db.threads.latestMessages, queryKey) ?? []
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

export const useMessageInt = (slug?: string, mNum?: number) => {
  const thread = useCacheQuery(api.db.threads.get, slug ? { slugOrId: slug } : 'skip')
  const message = useCacheQuery(
    api.db.threads.getMessage,
    slug && mNum ? { slugOrId: slug, series: mNum } : 'skip',
  )

  return {
    thread: thread as typeof thread | undefined,
    message: message as typeof message | undefined,
  }
}

export const useMessage = (slug?: string, msg?: string) => {
  const { thread } = useThreads(slug)
  const message = useCacheQuery(
    api.db.threads.getMessage,
    slug && msg ? { slugOrId: slug, series: parseInt(msg) } : 'skip',
  )

  return {
    thread,
    message,
  }
}

export const useChatModels = (): EChatModel[] | undefined => {
  const result = useCacheQuery(api.db.models.listChatModels, {})
  return result
}

export const useImageModels = (): EImageModel[] | undefined => {
  const result = useCacheQuery(api.db.models.listImageModels, {})
  return result
}

export const useImageModel = (resourceKey: string) => {
  const list = useImageModels()
  const model = list ? (list.find((model) => model.resourceKey === resourceKey) ?? null) : undefined
  return { model, list }
}

export const useVoiceModels = (): EVoiceModel[] | undefined => {
  const result = useCacheQuery(api.db.models.listVoiceModels, {})
  return result
}

export const useModels = (resourceKey?: string) => {
  const chatModels = useCacheQuery(api.db.models.listChatModels, {})
  const imageModels = useCacheQuery(api.db.models.listImageModels, {})

  const model = useMemo(() => {
    if (!resourceKey) return undefined
    return (
      chatModels?.find((model) => model.resourceKey === resourceKey) ??
      imageModels?.find((model) => model.resourceKey === resourceKey) ??
      null
    )
  }, [resourceKey, chatModels, imageModels])

  const result = useMemo(() => {
    return { chatModels, imageModels, model }
  }, [chatModels, imageModels, model])

  return result as Partial<typeof result>
}
