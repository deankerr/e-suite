import type {
  ChatCompletionConfig,
  EMessage,
  InferenceConfig,
  TextToAudioConfig,
  TextToImageConfig,
} from '../types'

export function getMessageName(message: EMessage) {
  const { textToImageConfig, textToAudioConfig } = extractInferenceConfig(message.inference)
  if (textToAudioConfig) return 'elevenlabs sound generation'
  if (textToImageConfig) {
    const modelName = message.images[0]?.generationData?.modelName
    return modelName ?? textToImageConfig.endpointModelId
  }
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  return 'Assistant'
}

export function getMessageText(message: EMessage) {
  if (message.text) return message.text

  const { textToImageConfig, textToAudioConfig } = extractInferenceConfig(message.inference)
  return textToImageConfig?.prompt ?? textToAudioConfig?.prompt
}

export function extractInferenceConfig(inference: InferenceConfig | undefined): {
  chatConfig: ChatCompletionConfig | null
  textToImageConfig: TextToImageConfig | null
  textToAudioConfig: TextToAudioConfig | null
} {
  return {
    chatConfig: inference?.type === 'chat-completion' ? inference : null,
    textToImageConfig: inference?.type === 'text-to-image' ? inference : null,
    textToAudioConfig: inference?.type === 'sound-generation' ? inference : null,
  }
}
