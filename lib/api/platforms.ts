import { fal } from './adapters/fal'
import { openai } from './adapters/openai'
import { openrouter } from './adapters/openrouter'
import { replicate } from './adapters/replicate'
import { togetherai } from './adapters/togetherai'

export const platformKeys = ['openai', 'openrouter', 'replicate', 'togetherai', 'fal'] as const
export const platforms = {
  openai: {
    adapters: openai,
    label: 'OpenAI',
  },
  openrouter: {
    adapters: openrouter,
    label: 'OpenRouter',
  },
  replicate: {
    adapters: replicate,
    label: 'Replicate',
  },
  togetherai: {
    adapters: togetherai,
    label: 'Together.ai',
  },
  fal: {
    adapters: fal,
    label: 'Fal.ai',
  },
} as const

export const adapterKeys = ['chat', 'image', 'illusion', 'tts'] as const
