import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalMutation, internalQuery, mutation } from './functions'
import { ridField, srcsetField } from './schema'
import { runWithRetries } from './utils'

// *** public queries ***
export const getHttp = internalQuery({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const generated_image = await ctx
      .table('generated_images', 'rid', (q) => q.eq('rid', rid))
      .unique()
    if (!generated_image || generated_image.deletionTime) return null

    return generated_image
  },
})

export const remove = mutation({
  args: {
    generatedImageId: zid('generated_images'),
  },
  handler: async (ctx, { generatedImageId }) => {
    await ctx.table('generated_images').getX(generatedImageId).delete()
  },
})
// *** end public queries ***

// export const create = internalMutation({
//   args: {
//     ...generatedImageFields,
//     generationJobId: zid('generation_jobs'),
//   },
//   handler: async (ctx, { generationJobId, ...fields }) => {
//     const job = await ctx.table('generation_jobs').getX(generationJobId)

//     const rid = await generateRid(ctx, 'generated_images')
//     const generatedImageId = await ctx.table('generated_images').insert({
//       ...fields,
//       messageId: job.messageId,
//       parameters: job.parameters,
//       rid,
//       private: false, // TODO
//     })

//     await runWithRetries(ctx, internal.lib.sharp.generatedImageSrcset, {
//       fileId: fields.fileId,
//       generatedImageId,
//     })
//   },
// })

export const updateSrcset = internalMutation({
  args: {
    generatedImageId: zid('generated_images'),
    srcset: srcsetField,
  },
  handler: async (ctx, { generatedImageId, srcset }) => {
    return await ctx.table('generated_images').getX(generatedImageId).patch({ srcset })
  },
})

export const checkSrcset = internalMutation({
  args: {
    generatedImageId: z.string(),
  },
  handler: async (ctx, { generatedImageId }) => {
    const id = ctx.unsafeDb.normalizeId('generated_images', generatedImageId)
    if (!id) return

    const image = await ctx.table('generated_images').getX(id)
    if (!image.srcset) {
      await runWithRetries(ctx, internal.lib.sharp.generatedImageSrcset, {
        fileId: image.fileId,
        generatedImageId: image._id,
      })
      console.log('checkSrcset:', image._id)
    }
  },
})

// //* Votes
// export const vote = mutation({
//   args: {
//     generationId: zid('generations'),
//     vote: generationVoteFields.vote,
//     constituent: generationVoteFields.constituent,
//   },
//   handler: async (ctx, { generationId, vote, constituent }) => {
//     const userId = ctx.viewerId ?? undefined

//     const existingVote = await ctx
//       .table('generation_votes', 'constituent_vote', (q) =>
//         q.eq('constituent', constituent).eq('generationId', generationId),
//       )
//       .unique()

//     if (existingVote) {
//       if (existingVote.vote === vote) return null // repeat vote
//       const hasAnonVoterLoggedIn = userId && !existingVote.userId
//       const args = hasAnonVoterLoggedIn ? { vote, userId } : { vote }
//       return await existingVote.patch(args)
//     }

//     return await ctx.table('generation_votes').insert({ generationId, vote, constituent, userId })
//   },
// })

// export const getMyVote = query({
//   args: {
//     generationId: zid('generations'),
//     constituent: generationVoteFields.constituent,
//   },
//   handler: async (ctx, { generationId, constituent }) => {
//     const vote = await ctx
//       .table('generation_votes', 'constituent_vote', (q) =>
//         q.eq('constituent', constituent).eq('generationId', generationId),
//       )
//       .unique()

//     return vote ? vote.vote : 'none'
//   },
// })

// export const _generateFakeVotes = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     const generations = await ctx.table('generations')
//     const constituent = crypto.randomUUID()

//     const votes = generations.flatMap(({ _id: generationId }) => {
//       const best = [...Array(Math.floor(Math.random() * 10 + 1))].map((_) => ({
//         constituent,
//         vote: 'best' as const,
//         generationId,
//       }))
//       const good = [...Array(Math.floor(Math.random() * 10 + 1))].map((_) => ({
//         constituent,
//         vote: 'good' as const,
//         generationId,
//       }))
//       const poor = [...Array(Math.floor(Math.random() * 10 + 1))].map((_) => ({
//         constituent,
//         vote: 'poor' as const,
//         generationId,
//       }))
//       const bad = [...Array(Math.floor(Math.random() * 10 + 1))].map((_) => ({
//         constituent,
//         vote: 'bad' as const,
//         generationId,
//       }))
//       return [...best, ...good, ...poor, ...bad]
//     })

//     await ctx.table('generation_votes').insertMany(votes)
//     console.log('created votes:', votes.length)
//   },
// })
