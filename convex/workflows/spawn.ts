import { internal } from '../_generated/api'
import { internalAction } from '../functions'

// * demo functions for testing with set input data

export const textToImage = internalAction({
  args: {},
  handler: async (ctx): Promise<string> => {
    const jobId = await ctx.runMutation(internal.workflows.engine.startWorkflow, {
      workflowType: 'textToImage',
      input: {
        messageId: 'jh78wrc3ebj62mrj54waegp42h6xsewt',
        resourceKey: 'fal::fal-ai/pixart-sigma',
        prompt: 'A beautiful landscape',
        n: 1,
        size: 'landscape',
        width: 1024,
        height: 1024,
      },
    })

    return jobId as string
  },
})
