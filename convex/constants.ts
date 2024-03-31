export const nsfwRatings = ['unknown', 'safe', 'low', 'high', 'x'] as const
export const modelBases = ['sd1.5', 'sdxl', 'dalle2', 'dalle3', 'unknown'] as const
export const modelTypes = ['checkpoint', 'lora', 'unknown'] as const
export const generationStatus = [
  'pending',
  'acting',
  'complete',
  'error',
  'failed',
  'cancelled',
] as const
export const dimensions = ['portrait', 'square', 'landscape'] as const

export const messageRoles = ['system', 'user', 'assistant', 'tool'] as const

export const chatProviders = ['openai', 'openrouter', 'togetherai']
export const textToSpeechProviders = ['elevenlabs', 'aws'] as const

export const defaultSystemPrompt =
  'You are an advanced AI assistant who can assist with any user query.'

export const defaultVoices = {
  user: 'aws/Russell',
  assistant: 'aws/Nicole',
  system: 'aws/Emma',
  tool: 'aws/Geraint',
} as const
