import { fal } from './adapters/fal'
import { openai } from './adapters/openai'
import { openrouter } from './adapters/openrouter'
import { replicate } from './adapters/replicate'
import { togetherai } from './adapters/togetherai'

export const PLATFORM = {
  openai: 'openai',
  openrouter: 'openrouter',
  replicate: 'replicate',
  fal: 'fal',
  togetherai: 'togetherai',
} as const
export type Platform = keyof typeof PLATFORM

export const PLATFORMS = ['openai', 'openrouter', 'replicate', 'fal', 'togetherai'] as const

export const ADAPTER = {
  chat: 'chat',
  image: 'image',
  illusion: 'illusion',
  tts: 'tts',
} as const
export type Adapter = keyof typeof ADAPTER

export const ADAPTERS = ['chat', 'image', 'illusion', 'tts'] as const
export type Adapters = keyof typeof ADAPTERS

export const adapters = {
  openai,
  openrouter,
  replicate,
  togetherai,
  fal,
} as const
