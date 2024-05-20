import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalQuery } from '../functions'
import { fal } from '../providers/fal'
import { sinkin } from '../providers/sinkin'
import { insist } from '../shared/utils'

import type { GenerationParameters } from '../threads/schema'

export const getJobMessage = internalQuery({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    const inference = message.inference
    insist(inference && inference.type === 'text-to-image', 'completion message lacks parameters', {
      message: JSON.stringify(message),
    })
    return { message, inference }
  },
})

export const textToImage = internalAction({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, { jobId }): Promise<void> => {
    const job = await ctx.runMutation(internal.jobs.manage.acquire, { jobId })

    const { inference } = await ctx.runQuery(internal.jobs.generation.getJobMessage, {
      messageId: job.messageId,
    })

    const { endpoint, parameters } = inference

    const { result, error } =
      endpoint === 'sinkin'
        ? await sinkin.textToImage({
            parameters: parameters as GenerationParameters,
            n: parameters.n,
          })
        : await fal.textToImage({ parameters: parameters as GenerationParameters, n: parameters.n })

    if (error) {
      if (error.noRetry) {
        await ctx.runMutation(internal.jobs.manage.results, {
          jobId,
          results: [{ type: 'error', value: error.message }],
          status: 'failed',
        })
        return
      }

      throw new ConvexError({ ...error })
    }

    await ctx.runMutation(internal.jobs.manage.results, {
      jobId,
      results: result.urls.map((url) => ({ type: 'url' as const, value: url })),
      status: 'complete',
    })
  },
})
