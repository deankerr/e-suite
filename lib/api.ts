import { useCallback, useMemo, useState } from 'react'
import { useTimeoutEffect } from '@react-hookz/web'
import { useQuery as useOriginalCacheQuery } from 'convex-helpers/react/cache/hooks'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

import type { EVoiceModel, RunConfig } from '@/convex/types'
import type { FunctionReference, FunctionReturnType } from 'convex/server'

const RUN_THROTTLE = 2500

export function useCacheQuery<T extends FunctionReference<'query'>>(
  query: T,
  args: any,
): FunctionReturnType<T> | undefined {
  return useOriginalCacheQuery<T>(query, args)
}

// * mutations
export type ThreadActions = ReturnType<typeof useThreadActions>
export const useThreadActions = (threadId?: string) => {
  const router = useRouter()
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

  const send = useCallback(
    async ({ text, method, ...runConfig }: RunConfig & { text: string; method: 'run' | 'add' }) => {
      if (!threadId) return false

      const addMessage = method === 'add' || (runConfig.type === 'chat' && text)
      const result = addMessage
        ? await append({
            message: {
              role: 'user',
              text,
            },
            runConfig: method !== 'add' ? runConfig : undefined,
          })
        : await run({
            runConfig,
          })

      if (result && result.threadId !== threadId) {
        router.push(`${appConfig.threadUrl}/${result.slug}`)
      }
      return !!result
    },
    [append, router, run, threadId],
  )

  return { run, append, send, state: actionState }
}

export const useUpdateThread = () => {
  return useMutation(api.db.threads.update)
}

export const useDeleteThread = () => {
  return useMutation(api.db.threads.remove)
}

export const useUpdateMessage = () => {
  return useMutation(api.db.messages.update)
}

export const useDeleteMessage = () => {
  return useMutation(api.db.messages.remove)
}

// * queries
export const useThreads = () => {
  const threads = useQuery(api.db.threads.list, {})
  threads?.sort((a, b) => {
    if (a.favorite === true && b.favorite !== true) {
      return -1 // Favorites come first
    }
    if (b.favorite === true && a.favorite !== true) {
      return 1 // Favorites come first
    }
    return b.updatedAtTime - a.updatedAtTime // Then sort by updatedAtTime
  })
  return threads
}

export const useThread = (threadId: string) => {
  const thread = useQuery(api.db.threads.get, { slugOrId: threadId })
  if (thread) {
    thread.title ??= 'Untitled Thread'
  }

  return thread
}

export const useThreadImages = (slug?: string, initialNumItems = 3) => {
  const images = usePaginatedQuery(api.db.threads.listImages, slug ? { slugOrId: slug } : 'skip', {
    initialNumItems,
  })
  return images
}

export const useThreadImagesSearch = (slug?: string, query = '') => {
  const images = useQuery(api.db.threads.searchImages, slug ? { slugOrId: slug, query } : 'skip')
  return images
}

export const useThreadJobs = (slug?: string) => {
  const jobs = useQuery(api.db.jobs.get, slug ? { threadId: slug } : 'skip')
  return jobs
}

export const useMessageId = (messageId?: string) => {
  const message = useQuery(api.db.messages.get, messageId ? { messageId } : 'skip')
  return message
}

export const useMessage = (slug?: string, msg?: string) => {
  const thread = useThread(slug ?? '')
  const message = useCacheQuery(
    api.db.threads.getMessage,
    slug && msg ? { slugOrId: slug, series: parseInt(msg) } : 'skip',
  )

  return {
    thread,
    message,
  }
}

export const useImage = (uid?: string) => {
  const image = useCacheQuery(api.db.images.getByUid, uid ? { uid } : 'skip')
  return image
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
