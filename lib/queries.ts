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
  const result = useQuery(api.db.models.listChatModels, {})
  return result
}

export const useImageModels = (): EImageModel[] | undefined => {
  const result = useQuery(api.db.models.listImageModels, {})
  return result
}

export const useVoiceModels = (): EVoiceModel[] | undefined => {
  const result = useQuery(api.db.models.listVoiceModels, {})
  return result
}
