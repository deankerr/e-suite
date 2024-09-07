import { v } from 'convex/values'

import { query } from '../functions'
import { generationsReturn, getGenerationEdges } from './generations'
import { getImageV2Edges, imagesReturn } from './images'

export const getGenerations = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return await ctx
      .table('generations_v2', 'runId', (q) => q.eq('runId', runId))
      .map(async (gen) => await getGenerationEdges(ctx, gen))
  },
  returns: v.array(generationsReturn),
})

export const getImages = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return await ctx
      .table('images_v2', 'runId', (q) => q.eq('runId', runId))
      .map(async (image) => await getImageV2Edges(ctx, image))
  },
  returns: v.array(imagesReturn),
})
