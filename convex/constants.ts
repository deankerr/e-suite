export const dimensions = ['portrait', 'square', 'landscape'] as const
export const messageRoles = ['system', 'user', 'assistant', 'tool'] as const

export const completionProviders = ['openai', 'openrouter', 'togetherai'] as const
export const generationProviders = ['sinkin'] as const
export const textToSpeechProviders = ['elevenlabs', 'aws'] as const

export const defaultSystemPrompt =
  'You are an advanced AI assistant who can assist with any user query.'

export const defaultVoices = {
  user: 'aws/Russell',
  assistant: 'aws/Nicole',
  system: 'aws/Emma',
  tool: 'aws/Geraint',
} as const

export const maxMessageContentStringLength = 32767
export const maxMessageNameStringLength = 32
export const maxTitleStringLength = 64

export const defaultRecentMessagesLimit = 50
