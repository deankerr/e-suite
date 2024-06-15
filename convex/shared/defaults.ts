import type { EChatCompletionInference, ETextToImageInference } from './structures'

export const defaultChatInferenceConfig: EChatCompletionInference = {
  type: 'chat-completion',
  resourceKey: 'together::meta-llama/Llama-3-70b-chat-hf',
  endpoint: 'together',
  endpointModelId: 'meta-llama/Llama-3-70b-chat-hf',
  stream: true,
}

export const defaultImageInferenceConfig: ETextToImageInference = {
  type: 'text-to-image',
  resourceKey: 'fal::fal-ai/hyper-sdxl',
  endpoint: 'fal',
  endpointModelId: 'fal-ai/hyper-sdxl',
  prompt: '',
  width: 1024,
  height: 1024,
  n: 4,
}

export const defaultThreadConfig = {
  ui: defaultChatInferenceConfig,
  saved: [],
}
