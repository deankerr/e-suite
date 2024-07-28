import type { ActionCtx } from '../_generated/server'
import type { TextToAudioWorkflow } from './types'

export const textToAudioWorkflow: TextToAudioWorkflow = {
  type: 'textToAudio',
  steps: [
    {
      name: 'textToAudioInference',
      retryLimit: 3,
      action: async (ctx: ActionCtx, input: any, previousResults: any) => {
        // TODO impl
      },
    },
  ],
}
