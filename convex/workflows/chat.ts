import type { ActionCtx } from '../_generated/server'
import type { ChatWorkflow } from './types'

export const chatWorkflow: ChatWorkflow = {
  type: 'chat',
  steps: [
    {
      name: 'chatInference',
      retryLimit: 3,
      action: async (ctx: ActionCtx, input: any, previousResults: any) => {
        // TODO impl
      },
    },
  ],
}
