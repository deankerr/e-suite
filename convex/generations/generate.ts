import { v } from 'convex/values'
import { internalAction } from '../_generated/server'

export const generate = internalAction({
  args: {
    id: v.id('jobs'),
  },
  handler: async (ctx, { id: jobId }): Promise<void> => {
    // const jobRef = await ctx.runMutation(internal.jobs.acquire, {
    //   id: jobId,
    //   type: 'generate',
    // })
    // const imageId = jobRef as Id<'images'>
    // const image = await ctx.runQuery(internal.files.images.get, { id: imageId })
    // const { parameters } = image
    // assert(parameters, 'Image has no parameters')
    // const imageModel = await ctx.runQuery(api.generations.imageModels.get, {
    //   id: parameters.imageModelId,
    // })
  },
})
