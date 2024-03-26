import { zid } from 'convex-helpers/server/zod'
import { httpRouter } from 'convex/server'
import z from 'zod'

import { internal } from './_generated/api'
import { Id } from './_generated/dataModel'
import { httpAction } from './_generated/server'
import { clerkWebhookHandler } from './providers/clerk'
import { generateSha256Hash } from './util'
import { messageValidator, voiceoverValidator } from './validators'

const http = httpRouter()

http.route({
  path: '/internal/clerk/webhook/v1',
  method: 'POST',
  handler: clerkWebhookHandler,
})

//* Assets
http.route({
  path: '/image',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url)
    const storageId = searchParams.get('storageId') as Id<'_storage'>
    const blob = await ctx.storage.get(storageId)
    if (blob === null) {
      return new Response('Image not found', {
        status: 400,
      })
    }
    return new Response(blob, {
      headers: {
        'content-type': 'image/png',
        'content-disposition': `attachment; filename="${storageId}.png"`,
      },
    })
  }),
})

//* Threads
const threadsMessagesPushRequestSchema = z.object({
  apiKey: z.string().length(32, 'Invalid api key'),
  threadId: zid('threads'),
  message: messageValidator,
  voiceover: voiceoverValidator.optional(),
})

http.route({
  path: '/threads/messages/push',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const parsed = threadsMessagesPushRequestSchema.safeParse(await request.json())
    if (!parsed.success) {
      console.error(parsed.error.issues)
      return new Response(parsed.error.message, { status: 400 })
    }
    const { apiKey, threadId, message, voiceover } = parsed.data

    // authenticate access to thread
    const ownerId = await ctx.runQuery(internal.apiKeys.authorizeThreadOwner, {
      threadId,
      apiKey,
    })
    if (!ownerId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const messageId = await ctx.runMutation(internal.threads.threads.pushMessage, {
      id: threadId,
      message,
    })

    if (voiceover) {
      await ctx.runMutation(internal.threads.threads.pushVoiceover, {
        messageId,
        voiceover: {
          ...voiceover,
          textSha256: await generateSha256Hash(voiceover.text),
        },
      })
    }

    return new Response('OK', { status: 200 })
  }),
})

export default http
