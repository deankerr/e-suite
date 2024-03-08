import { httpRouter } from 'convex/server'
import z from 'zod'
import { internal } from './_generated/api'
import { Id } from './_generated/dataModel'
import { httpAction } from './_generated/server'
import { clerkWebhookHandler } from './providers/clerk'
import { messageValidator, voiceoverRequestValidator } from './validators'

const http = httpRouter()

http.route({
  path: '/internal/clerk/webhook/v1',
  method: 'POST',
  handler: clerkWebhookHandler,
})

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

http.route({
  path: '/thread',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // parse request
    const requestSchema = z.object({
      apiKey: z.string().length(32, 'Invalid api key'),
      threadId: z
        .string()
        .length(32, 'Invalid thread id')
        .transform((v) => v as Id<'threads'>),
      messages: z
        .array(
          messageValidator.merge(z.object({ voiceover: voiceoverRequestValidator.optional() })),
        )
        .min(1),
    })

    const parsed = requestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return new Response(parsed.error.message, { status: 400 })
    }

    // authenticate access to thread
    const ownerId = await ctx.runQuery(internal.apiKeys.authorizeThreadOwner, {
      threadId: parsed.data.threadId,
      apiKey: parsed.data.apiKey,
    })
    if (!ownerId) {
      return new Response('Unauthorized', { status: 401 })
    }

    for (const item of parsed.data.messages) {
      const { voiceover, ...message } = item
      const messageId = await ctx.runMutation(internal.threads.threads.pushMessage, {
        id: parsed.data.threadId,
        message,
      })

      if (voiceover) {
        await ctx.runMutation(internal.threads.threads.pushVoiceover, {
          messageId,
          voiceover,
        })
      }
    }

    return new Response('OK', { status: 200 })
  }),
})

export default http
