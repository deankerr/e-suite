import FalModelsJson from './providers/fal.models.json'
import SinkinModelsJson from './providers/sinkin.models.json'

const falAvailableIds = ['fal-ai/hyper-sdxl', 'fal-ai/fast-lightning-sdxl', 'fal-ai/pixart-sigma']

const fal = FalModelsJson.filter(({ model_id }) => falAvailableIds.includes(model_id)).map(
  (model) => ({ ...model, provider: 'fal' as const }),
)
const sinkin = SinkinModelsJson.map((model) => ({ ...model, provider: 'sinkin' as const }))

export const modelsList = [fal, sinkin].flat()
