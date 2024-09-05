import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebouncedState, useTimeoutEffect } from '@react-hookz/web'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

import type { RunConfig } from '@/convex/types'

const RUN_THROTTLE = 2500

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

export const useImageGenerationBatches = (imageId = '') => {
  const results = useQuery(api.db.images.getGenerationBatches, imageId ? { imageId } : 'skip')
  const buffer = useRef(results)

  if (results !== undefined) {
    buffer.current = results
  }

  return buffer.current
}

export const useViewer = () => {
  return useQuery(api.users.getViewer, {})
}
