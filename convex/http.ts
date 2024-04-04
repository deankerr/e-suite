import { zid } from 'convex-helpers/server/zod'
import { httpRouter } from 'convex/server'
import { ConvexError } from 'convex/values'
import z from 'zod'
import { fromZodError } from 'zod-validation-error'

import { api } from './_generated/api'
import { httpAction } from './_generated/server'
import { handleWebhook } from './providers/clerk'
import { messagesFields } from './schema'

import type { Id } from './_generated/dataModel'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
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
  path: '/threads/messages/create',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const apiKey = request.headers.get('ApiKey')
    if (apiKey === null) return new Response('Unauthorized', { status: 401 })

    const parsed = z
      .object({ threadId: zid('threads'), messages: z.object(messagesFields).array() })
      .safeParse(await request.json())

    if (!parsed.success) {
      const zodError = fromZodError(parsed.error)
      console.error(zodError)
      return new Response(zodError.toString(), { status: 400 })
    }

    const { threadId, messages } = parsed.data

    try {
      await ctx.runMutation(api.messages.createMany, {
        apiKey,
        threadId,
        messages,
      })

      return new Response('OK', { status: 200 })
    } catch (err) {
      console.error(err)
      if (err instanceof ConvexError) {
        if ('status' in err && err.status === 401) {
          return new Response('Unauthorized', { status: 401 })
        }
      }
      return new Response('Internal Server Error', { status: 500 })
    }
  }),
})

export default http
