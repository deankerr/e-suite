import { httpRouter } from 'convex/server'
import z from 'zod'
import { Id } from './_generated/dataModel'
import { httpAction } from './_generated/server'
import { clerkWebhookHandler } from './providers/clerk'

const http = httpRouter()

http.route({
  path: '/image',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url)
    //TODO authorized to get image
    const storageId = searchParams.get('storageId') as Id<'_storage'>
    const blob = await ctx.storage.get(storageId)
    if (blob === null) {
      return new Response('Image not found', {
        status: 400,
      })
    }
    return new Response(blob)
  }),
})

const chatRequestSchema = z.object({
  threadId: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        name: z.string().optional(),
        content: z.string(),
      }),
    )
    .min(1),
  temp_runChatProfileId: z.string().optional(),
  webhook: z.string().url(),
  authToken: z.string(),
})

// http.route({
//   path: '/chat_va1',
//   method: 'POST',
//   handler: httpAction(async (ctx, request) => {
//     const json = await request.json()
//     const chatReq = chatRequestSchema.parse(json)
//     const auth = await ctx.runQuery(internal.authTokens.validate, { token: chatReq.authToken })
//     if (!auth) return new Response('Unauthorized', { status: 401 })

//     const threadId = (chatReq.threadId ??
//       (await ctx.runMutation(internal.chat.threads.create, {
//         ownerInfo: auth.ownerInfo,
//         ownerAuthTokenId: auth._id,
//       }))) as Id<'threads'>
//     const chatMessageIds = await Promise.all(
//       chatReq.messages.map(
//         async (message) =>
//           await ctx.runMutation(internal.chat.messages.create, { threadId, ...message }),
//       ),
//     )
//     const resultMessageId = await ctx.runMutation(internal.chat.messages.create, {
//       threadId,
//       role: 'assistant',
//       content: '',
//     })

//     const jobId = await ctx.runMutation(internal.jobs.create, {
//       chat: {
//         chatMessageIds,
//         resultMessageId,
//         chatParameters: { model: 'temp' },
//         chatProvider: 'togetherai',
//       },
//     })

//     //TODO webhook
//     return new Response(JSON.stringify({ jobId, threadId }), {
//       headers: {
//         'content-type': 'application/json',
//       },
//     })
//   }),
// })

const generateRequestSchema = z.object({
  authToken: z.string().min(1),
  prompt: z.string().min(1),
  model: z.string().optional(),
})

// http.route({
//   path: '/generate_va1',
//   method: 'POST',
//   handler: httpAction(async (ctx, request) => {
//     const json = await request.json()
//     const genReq = generateRequestSchema.parse(json)
//     // const auth = await ctx.runQuery(internal.authTokens.validate, { token: genReq.authToken })
//     const auth = true //! temp
//     if (!auth) return new Response('Unauthorized', { status: 401 })

//     await ctx.runMutation(internal.generations.createRandom, { prompt: genReq.prompt })

//     return new Response('', { status: 200 })
//   }),
// })

http.route({
  path: '/internal/clerk/webhook/v1',
  method: 'POST',
  handler: clerkWebhookHandler,
})

export default http
