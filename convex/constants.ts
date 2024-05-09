//* Providers
export const completionProviders = ['openai', 'openrouter', 'togetherai'] as const
export const generationProviders = ['sinkin', 'fal'] as const
export const textToSpeechProviders = ['elevenlabs', 'aws'] as const

//* Messages
export const messageRoles = ['system', 'user', 'assistant', 'tool'] as const
export const defaultSystemPrompt =
  'You are an advanced AI assistant who can assist with any user query.'
export const maxMessageContentStringLength = 32767
export const maxMessageNameStringLength = 64
export const maxTitleStringLength = 256

//* Audio
export const defaultVoices = {
  user: 'aws/Russell',
  assistant: 'aws/Nicole',
  system: 'aws/Emma',
  tool: 'aws/Geraint',
} as const

//* Generations
export const generationVoteNames = ['best', 'good', 'poor', 'bad', 'none'] as const
export const imageSrcsetWidths = [
  128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
] as const
export const imageGenerationSizes = [
  'square',
  'square_hd',
  'portrait_4_3',
  'portrait_16_9',
  'landscape_4_3',
  'landscape_16_9',
] as const
export const imageGenerationSizesMap = {
  square: {
    width: 512,
    height: 512,
  },
  square_hd: {
    width: 1024,
    height: 1024,
  },
  portrait_4_3: {
    width: 512,
    height: 768,
  },
  portrait_16_9: {
    width: 768,
    height: 1024,
  },
  landscape_4_3: {
    width: 768,
    height: 512,
  },
  landscape_16_9: {
    width: 1024,
    height: 768,
  },
}

//* App
export const ridLength = 6
export const maxInputStringLength = 32767
