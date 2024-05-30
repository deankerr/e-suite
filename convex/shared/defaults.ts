import type { EChatCompletionInference, ETextToImageInference } from './structures'

export const defaultChatInferenceConfig: EChatCompletionInference = {
  type: 'chat-completion',
  resourceId: 'together::meta-llama/Llama-3-70b-chat-hf',
  endpoint: 'together',
  parameters: {
    model: 'meta-llama/Llama-3-70b-chat-hf',
    stream: true,
  },
}

export const defaultImageInferenceConfig: ETextToImageInference = {
  type: 'text-to-image',
  resourceId: 'fal::fal-ai/hyper-sdxl',
  endpoint: 'fal',
  parameters: {
    model: 'fal-ai/hyper-sdxl',
    prompt: '',
    width: 1024,
    height: 1024,
    n: 4,
  },
}
