import { useQuery as useCachedQuery } from 'convex-helpers/react/cache/hooks'
import { useQuery as useConvexQuery, usePaginatedQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import {
  EChatModel,
  EImageModel,
  EMessage,
  EThread,
  EUser,
  EVoiceModel,
} from '@/convex/shared/types'

const shouldUseCachedQuery = false
const useQuery = shouldUseCachedQuery ? useCachedQuery : useConvexQuery

export const useThread = ({ slug = '' }: { slug?: string }): EThread | null | undefined => {
  const thread = useQuery(api.db.threads.get, {
    slugOrId: slug,
  })

  return thread
}

export const useMessages = ({
  threadId,
  limit = 25,
}: {
  threadId?: string
  limit?: number
}): EMessage[] | undefined => {
  const messages = useQuery(
    api.db.messages.list,
    threadId
      ? {
          threadId,
          limit,
          order: 'desc',
        }
      : 'skip',
  )

  return messages
}

export const usePaginatedMessages = ({ threadId }: { threadId?: string }) => {
  const result = usePaginatedQuery(
    api.db.messages.paginate,
    threadId ? { threadId, order: 'desc' } : 'skip',
    {
      initialNumItems: 25,
    },
  )

  return result
}

export const useMessagesQuery = ({
  slugOrId,
  hasAssistantRole = false,
  hasImageFiles = false,
  hasSoundEffectFiles = false,
}: {
  slugOrId?: string
  hasAssistantRole?: boolean
  hasImageFiles?: boolean
  hasSoundEffectFiles?: boolean
}) => {
  const result = usePaginatedQuery(
    api.db.messages.content,
    slugOrId ? { slugOrId, hasImageFiles, hasSoundEffectFiles, hasAssistantRole } : 'skip',
    {
      initialNumItems: 25,
    },
  )
  return result
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
