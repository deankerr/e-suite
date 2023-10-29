export const PLATFORMS = {
  openai: 'openai',
  openrouter: 'openrouter',
  replicate: 'replicate',
  fal: 'fal',
  togetherai: 'togetherai',
} as const

export type Platforms = keyof typeof PLATFORMS
