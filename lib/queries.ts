import { useQuery } from 'convex-helpers/react'

import { api } from '@/convex/_generated/api'

export const useThread = (slugOrId: string) => {
  const result = useQuery(
    api.db.threads.get,
    slugOrId
      ? {
          slugOrId,
        }
      : 'skip',
  )
  return result
}

export const useMessages = (threadId?: string) => {
  const result = useQuery(
    api.db.messages.list,
    threadId
      ? {
          threadId,
        }
      : 'skip',
  )
  return result.data
}

export const useUserThreadsList = () => {
  const result = useQuery(api.db.threads.list, {})
  result.data?.sort((a, b) => b.updatedAtTime - a.updatedAtTime)
  return result
}

export const useMessagesList = (
  threadId: string,
  options: { limit?: number; order?: 'asc' | 'desc' } = {},
) => {
  const result = useQuery(api.db.messages.list, {
    threadId,
    ...options,
  })

  return result
}

export const useViewer = () => useQuery(api.users.getViewer, {})

export const useViewerDetails = (ownerId?: string) => {
  const user = useQuery(api.users.getViewer, {})
  const isOwner = user.data?._id === ownerId
  const isAdmin = user.data?.role === 'admin'
  return { user, isOwner, isAdmin }
}

export const useChatModels = () => {
  const result = useQuery(api.db.chatModels.list, {})
  return result
}

export const useImageModels = () => {
  const result = useQuery(api.db.imageModels.list, {})
  return result
}
