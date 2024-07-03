import type { ChatCompletionConfig, TextToImageConfig } from '../types'

export const defaultChatInferenceConfig: ChatCompletionConfig = {
  type: 'chat-completion',
  resourceKey: 'together::meta-llama/Llama-3-70b-chat-hf',
  endpoint: 'together',
  endpointModelId: 'meta-llama/Llama-3-70b-chat-hf',
  stream: true,
}

export const defaultImageInferenceConfig: TextToImageConfig = {
  type: 'text-to-image',
  resourceKey: 'fal::fal-ai/stable-diffusion-v3-medium',
  endpoint: 'fal',
  endpointModelId: 'fal-ai/stable-diffusion-v3-medium',
  prompt: '',
  width: 1024,
  height: 1024,
  n: 4,
}
