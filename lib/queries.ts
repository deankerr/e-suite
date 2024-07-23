import { useQuery as useConvexQuery, usePaginatedQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { EChatModel, EImageModel, EThread, EUser, EVoiceModel } from '@/convex/types'

const useQuery = useConvexQuery

export const useThread = ({ slug = '' }: { slug?: string }): EThread | null | undefined => {
  const thread = useQuery(api.db.threads.get, {
    slugOrId: slug,
  })

  return thread
}

export const useMessagesList = ({
  slugOrId,
  filters,
}: {
  slugOrId?: string
  filters?: {
    role?: 'user' | 'assistant'
    hasContent?: 'image' | 'audio'
  }
}) => {
  const result = usePaginatedQuery(
    api.db.messages.list,
    slugOrId ? { slugOrId, filters } : 'skip',
    {
      initialNumItems: 25,
    },
  )
  return result
}

export const useSeriesMessage = ({ slug, series }: { slug?: string; series?: string }) => {
  const result = useQuery(
    api.db.messages.getSeriesMessage,
    slug && series
      ? {
          slug,
          series: Number(series),
        }
      : 'skip',
  )
  return result
}

export const useUserThreadsList = (): EThread[] | undefined => {
  const result = useQuery(api.db.threads.list, {})
  result?.sort((a, b) => b.updatedAtTime - a.updatedAtTime)
  return result
}

export const useViewerDetails = (
  checkOwnerId?: string,
): { user: EUser | null | undefined; isOwner: boolean; isAdmin: boolean } => {
  const user = useQuery(api.users.getViewer, {})
  const isOwner = user?._id === checkOwnerId
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
