import { useUser } from '@clerk/nextjs'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { useSelectedLayoutSegments } from 'next/navigation'

import { api } from '@/convex/_generated/api'

export const useThreadCtx = () => {
  const segments = useSelectedLayoutSegments()
  const [route, rid] = segments
  const queryKey = route === 'thread' && rid ? { rid } : 'skip'
  const thread = useQuery(api.threads.get, queryKey)

  return thread
}

export const useThreadFeed = ({ rid }: { rid: string }) => {
  const thread = useQuery(api.threads.get, { rid })
  const pager = usePaginatedQuery(api.threads.messages, { rid }, { initialNumItems: 5 })

  return { thread, pager }
}

export const useMessageQuery = ({ rid }: { rid: string }) => {
  const result = useQuery(api.messages.get, { rid })
  return result
}

// export const useGeneration = ({ rid }: { rid: string }) => {
//   const result = useQuery(api.generation.get, { rid })
//   return result
// }

export const useCurrentUserThreads = () => {
  const self = useQuery(api.users.getSelf, {})

  const threads = useQuery(api.threads.list, {})
  const createThread = useMutation(api.threads.create)
  const removeThread = useMutation(api.threads.remove)

  const userAuth = useUser()

  return { self, threads, createThread, removeThread, userAuth }
}

// export const useInsecureDemoOnlyGenerationList = () => {
//   const pager = usePaginatedQuery(api.generation._list, {}, { initialNumItems: 10 })
//   return pager
// }

export const useModelList = (skip?: 'skip') => {
  const models = useQuery(api.models.list, skip ?? {})
  return models
}
