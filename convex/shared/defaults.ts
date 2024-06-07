import type { EChatCompletionInference, ETextToImageInference } from './structures'

export const defaultChatInferenceConfig: EChatCompletionInference = {
  type: 'chat-completion',
  endpoint: 'together',
  model: 'meta-llama/Llama-3-70b-chat-hf',
  stream: true,
}

export const defaultImageInferenceConfig: ETextToImageInference = {
  type: 'text-to-image',
  endpoint: 'fal',
  model: 'fal-ai/hyper-sdxl',
  prompt: '',
  width: 1024,
  height: 1024,
  n: 4,
}
