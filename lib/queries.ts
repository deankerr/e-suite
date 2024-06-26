import { useQuery } from 'convex-helpers/react'
import { useQuery as useCachedQuery } from 'convex-helpers/react/cache/hooks'

import { api } from '@/convex/_generated/api'
import { EChatModel, EImageModel, EThread, EUser, EVoiceModel } from '@/convex/shared/types'

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
          limit: 25,
        }
      : 'skip',
  )

  if (!threadId) {
    result.data = []
    result.isSuccess = true
    result.isPending = false
  }
  return result
}

export const useUserThreadsList = (): EThread[] | undefined => {
  const result = useCachedQuery(api.db.threads.list, {})
  result?.sort((a, b) => b.updatedAtTime - a.updatedAtTime)
  return result
}

export const useViewerDetails = (
  ownerId?: string,
): { user: EUser | null | undefined; isOwner: boolean; isAdmin: boolean } => {
  const user = useCachedQuery(api.users.getViewer, {})
  const isOwner = user?._id === ownerId
  const isAdmin = user?.role === 'admin'
  return { user, isOwner, isAdmin }
}

export const useChatModels = (): EChatModel[] | undefined => {
  const result = useCachedQuery(api.db.chatModels.list, {})
  return result
}

export const useImageModels = (): EImageModel[] | undefined => {
  const result = useCachedQuery(api.db.imageModels.list, {})
  return result
}

export const useVoiceModels = (): EVoiceModel[] | undefined => {
  const result = useCachedQuery(api.db.voiceModels.list, {})
  return result
}
