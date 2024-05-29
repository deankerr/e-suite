import { chatModels, imageModels } from '@/convex/shared/models'

export const useModelsData = () => {
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
