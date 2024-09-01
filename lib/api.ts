import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebouncedState, useTimeoutEffect } from '@react-hookz/web'
import { useQuery as useOriginalCacheQuery } from 'convex-helpers/react/cache/hooks'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'
import type { EVoiceModel, RunConfig } from '@/convex/types'
import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'

const RUN_THROTTLE = 2500

export function useCacheQuery<T extends FunctionReference<'query'>>(
  query: T,
  args: FunctionArgs<T> | 'skip',
): FunctionReturnType<T> | undefined {
  return useOriginalCacheQuery<T>(query, args)
}

// * mutations
export const useGenerate = () => {
  return useMutation(api.db.generations.create)
}

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

export const useDeleteImage = () => {
  return useMutation(api.db.images.remove)
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

export const useThreadImagesSearch = (slug?: string, query = '', initialNumItems = 3) => {
  const [queryValue, setQueryValue] = useDebouncedState(query, 300)
  useEffect(() => {
    setQueryValue(query)
  }, [query, setQueryValue])

  const images = usePaginatedQuery(
    api.db.threads.searchImages,
    slug && query && queryValue ? { slugOrId: slug, query: queryValue } : 'skip',
    {
      initialNumItems,
    },
  )
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

export const useMessageDoc = (messageId?: Id<'messages'>) => {
  return useCacheQuery(api.db.messages.getDoc, messageId ? { messageId } : 'skip')
}

export const useImage = (imageId?: string) => {
  const image = useCacheQuery(api.db.images.get, imageId ? { imageId } : 'skip')
  return image
}

export const useImageGenerationBatches = (imageId = '') => {
  const results = useQuery(api.db.images.getGenerationBatches, imageId ? { imageId } : 'skip')
  const buffer = useRef(results)

  if (results !== undefined) {
    buffer.current = results
  }

  return buffer.current
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

// * collections
export const useCollection = (collectionId?: Id<'collections'>) => {
  const collection = useQuery(api.db.collections.get, collectionId ? { collectionId } : 'skip')
  return collection
}
