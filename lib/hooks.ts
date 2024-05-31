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
  const getModel = (key: [endpoint: string, endpointModelId: string] | string) => {
    const [endpoint = '', endpointModelId = ''] = typeof key === 'string' ? key.split('::') : key
    const model = models.find(
      (model) => model.endpoint === endpoint && model.endpointModelId === endpointModelId,
    )
    if (!model) throw new Error(`invalid model key: ${JSON.stringify(key)}`)
    return model
  }

  return { models, getModel, chatModels, imageModels }
}
