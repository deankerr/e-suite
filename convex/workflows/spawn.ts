import { omit } from 'convex-helpers'
import { partial } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { runConfigTextToImageV } from '../schema'

// * demo functions for testing with set input data

export const spawnTextToImageJob = internalAction({
  args: {
    input: v.optional(v.object(partial(omit(runConfigTextToImageV.fields, ['type'])))),
  },
  handler: async (ctx, args): Promise<string> => {
    const jobId = await ctx.runMutation(internal.workflows.engine.startJob, {
      pipeline: 'textToImage',
      input: {
        messageId: 'jh78wrc3ebj62mrj54waegp42h6xsewt',
        resourceKey: 'fal::fal-ai/pixart-sigma',
        prompt: 'A beautiful landscape',
        n: 2,
        width: 1024,
        height: 1024,

        ...args.input,
      },
    })

    return jobId as string
  },
})
