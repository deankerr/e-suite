import { useMedia } from 'react-use'

import { chatModels, imageModels } from '@/convex/shared/models'

export const useTwMediaQuery = () => {
  return {
    sm: useMedia('(min-width: 520px)', false),
    md: useMedia('(min-width: 768px)', false),
    lg: useMedia('(min-width: 1024px)', false),
    xl: useMedia('(min-width: 1280px)', false),
    '2xl': useMedia('(min-width: 1640px)', false),
  }
}

export const useModelData = () => {
  const models = [...chatModels, ...imageModels]
  const getModel = (endpoint: string, endpointModelId: string) => {
    const model = models.find(
      (model) => model.endpoint === endpoint && model.endpointModelId === endpointModelId,
    )
    if (!model) throw new Error(`invalid model: ${endpoint} ${endpointModelId}`)
    return model
  }

  return { models, getModel, chatModels, imageModels }
}
