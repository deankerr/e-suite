export const completionProviders = ['openai', 'openrouter', 'togetherai'] as const
export const generationProviders = ['sinkin', 'fal'] as const
export const textToSpeechProviders = ['elevenlabs', 'aws'] as const

export const messageRoles = ['system', 'user', 'assistant', 'tool'] as const
export const defaultSystemPrompt =
  'You are an advanced AI assistant who can assist with any user query.'
export const maxMessageContentStringLength = 32767
export const maxMessageNameStringLength = 64
export const maxTitleStringLength = 256

export const defaultVoices = {
  user: 'aws/Russell',
  assistant: 'aws/Nicole',
  system: 'aws/Emma',
  tool: 'aws/Geraint',
} as const

export const generationVoteNames = ['best', 'good', 'poor', 'bad', 'none'] as const
export const imageSrcsetWidths = [
  128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
] as const

export const ridLength = 6
