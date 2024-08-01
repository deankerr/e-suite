import { useQuery as useConvexQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { EChatModel, EImageModel, EUser, EVoiceModel } from '@/convex/types'

const useQuery = useConvexQuery

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
