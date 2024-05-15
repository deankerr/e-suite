// export const run = internalAction({
//   args: {
//     generationJobId: zid('generation_jobs'),
//   },
//   handler: async (ctx, { generationJobId }) => {
//     const { parameters } = await ctx.runMutation(internal.generation_jobs.acquire, {
//       generationJobId,
//     })

//     const { result, error } =
//       parameters.provider === 'sinkin'
//         ? await sinkin.textToImage({
//             parameters: parameters as GenerationParameters,
//             n: parameters.n,
//           })
//         : await fal.textToImage({ parameters: parameters as GenerationParameters, n: parameters.n })

//     if (error) {
//       if (error.noRetry) {
//         await ctx.runMutation(internal.generation_jobs.result, {
//           generationJobId,
//           result: { type: 'error', items: [error.message] },
//           status: 'failed',
//         })
//         return
//       }

//       throw new ConvexError({ ...error })
//     }

//     await ctx.runMutation(internal.generation_jobs.result, {
//       generationJobId,
//       result: { type: 'url', items: result.urls },
//       status: 'complete',
//     })
//   },
// })
