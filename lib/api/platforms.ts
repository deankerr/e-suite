import { fal } from './adapters/fal'
import { openai } from './adapters/openai'
import { openrouter } from './adapters/openrouter'
import { replicate } from './adapters/replicate'
import { togetherai } from './adapters/togetherai'

export const platformKeys = ['openai', 'openrouter', 'replicate', 'togetherai', 'fal'] as const
export const platforms = {
  openai,
  openrouter,
  replicate,
  togetherai,
  fal,
} as const

export const adapterKeys = ['chat', 'image', 'illusion', 'tts'] as const
