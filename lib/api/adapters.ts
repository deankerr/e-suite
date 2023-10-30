import { fal } from './platforms/fal.adapters'
import { openai } from './platforms/openai.adapters'
import { openrouter } from './platforms/openrouter.adapters'
import { replicate } from './platforms/replicate.adapters'
import { togetherai } from './platforms/togetherai.adapters'

export const adapters = {
  openai,
  openrouter,
  // replicate,
  togetherai,
  // fal,
} as const
