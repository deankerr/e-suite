import { useQuery as useConvexQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { EChatModel, EImageModel, EVoiceModel } from '@/convex/types'

const useQuery = useConvexQuery

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
