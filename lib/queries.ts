import { useMemo } from 'react'
import { useQuery as useCachedQuery } from 'convex-helpers/react/cache/hooks'
import { useQuery as useConvexQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import {
  EChatModel,
  EImageModel,
  EMessage,
  EThread,
  EUser,
  EVoiceModel,
} from '@/convex/shared/types'
import { environment } from '@/lib/utils'

const useQuery = environment === 'dev' ? useConvexQuery : useCachedQuery

export const useThread = ({ slug = '' }: { slug?: string }): EThread | null | undefined => {
  const thread = useQuery(api.db.threads.get, {
    slugOrId: slug,
  })

  return useMemo(() => {
    return thread
  }, [thread])
}

export const useMessages = ({ threadId = '' }: { threadId?: string }): EMessage[] | undefined => {
  const messages = useQuery(api.db.messages.list, {
    threadId,
    limit: 25,
  })

  return useMemo(() => {
    return messages
  }, [messages])
}

export const useUserThreadsList = (): EThread[] | undefined => {
  const result = useQuery(api.db.threads.list, {})
  result?.sort((a, b) => b.updatedAtTime - a.updatedAtTime)
  return result
}

export const useViewerDetails = (
  ownerId?: string,
): { user: EUser | null | undefined; isOwner: boolean; isAdmin: boolean } => {
  const user = useQuery(api.users.getViewer, {})
  const isOwner = user?._id === ownerId
  const isAdmin = user?.role === 'admin'
  return { user, isOwner, isAdmin }
}

export const useChatModels = (): EChatModel[] | undefined => {
  const result = useQuery(api.db.chatModels.list, {})
  return result
}

export const useImageModels = (): EImageModel[] | undefined => {
  const result = useQuery(api.db.imageModels.list, {})
  return result
}

export const useVoiceModels = (): EVoiceModel[] | undefined => {
  const result = useQuery(api.db.voiceModels.list, {})
  return result
}
