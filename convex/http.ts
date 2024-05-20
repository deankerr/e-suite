import { httpRouter } from 'convex/server'
import OpenAI from 'openai'

import { internal } from './_generated/api'
import { httpAction } from './_generated/server'
import { serveImage } from './images/manage'
import { handleWebhook } from './providers/clerk'
import { hasDelimiter } from './shared/utils'

import type { Id } from './_generated/dataModel'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

http.route({ pathPrefix: '/i/', method: 'GET', handler: serveImage })

// TODO temp, add db integration, access control
const chatEnabled = false
http.route({
  path: '/chat',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    if (!chatEnabled) return new Response('chat disabled', { status: 403 })
    const body = await request.json()
    const messageId: Id<'messages'> = body.messageId

    const openai = new OpenAI()

    // Create a TransformStream to handle streaming data
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const textEncoder = new TextEncoder()

    const streamData = async () => {
      let content = ''
      try {
        const stream = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: "You are a really excited bot in a group chat responding to q's.",
            },
            {
              role: 'user',
              content: 'Explain how http CORS works',
            },
          ],
          stream: true,
        })

        // loop over the data as it is streamed and write to the writeable
        // also periodically update the message in the database
        for await (const part of stream) {
          const text = part.choices[0]?.delta?.content || ''
          content += text
          await writer.write(textEncoder.encode(text))
          if (hasDelimiter(text)) {
            await ctx.runMutation(internal.threads.mutate.updateMessage, {
              messageId,
              text: content,
            })
          }
        }
        await ctx.runMutation(internal.threads.mutate.updateMessage, {
          messageId,
          text: content,
        })
        await writer.close()
      } catch (e) {
        if (e instanceof OpenAI.APIError) {
          console.error(e.status)
          console.error(e.message)
          // await ctx.runMutation(internal.messages.update, {
          //   messageId,
          //   body: "OpenAI call failed: " + e.message,
          //   isComplete: true,
          // });
          return
        } else {
          throw e
        }
      }
    }
    void streamData()

    // Send the readable back to the browser
    return new Response(readable, {
      // CORS headers -- https://docs.convex.dev/functions/http-actions#cors
      headers: {
        'Access-Control-Allow-Origin': '*',
        Vary: 'origin',
      },
    })
  }),
})

// Taken from https://docs.convex.dev/functions/http-actions#cors
http.route({
  path: '/chat',
  method: 'OPTIONS',
  // eslint-disable-next-line @typescript-eslint/require-await
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers
    if (
      headers.get('Origin') !== null &&
      headers.get('Access-Control-Request-Method') !== null &&
      headers.get('Access-Control-Request-Headers') !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Digest',
          'Access-Control-Max-Age': '86400',
        }),
      })
    } else {
      return new Response()
    }
  }),
})

export default http
