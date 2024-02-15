import { v } from 'convex/values'
import z from 'zod'
import { internal } from '../_generated/api'
import { internalAction } from '../_generated/server'
import { assert } from '../util'

export const inference = internalAction({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, { messageId }): Promise<void> => {
    try {
      const messages = await ctx.runQuery(internal.threads.do.getMessageContext, {
        id: messageId,
      })

      const message = messages.pop()
      assert(message, 'inference target message missing')
      const inferenceParameters =
        'inferenceParameters' in message ? message.inferenceParameters : null
      assert(inferenceParameters, 'inference parameters missing')

      const body = {
        ...inferenceParameters,
        stop: ['</s>', '[/INST]'], // TODO relevant stop strings
        n: 1,
        messages: messageSchema.array().parse(messages),
      }
      console.log(body)

      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.TOGETHERAI_API_KEY}`,
        },
        body: JSON.stringify(body),
      })
      const json = await response.json()

      console.log('response', json)
      const {
        choices: [m],
      } = responseSchema.parse(json)

      await ctx.runMutation(internal.threads.do.streamMessageContent, {
        id: messageId,
        content: m?.message.content ?? '{{ Response missing? }}',
      })

      await ctx.runMutation(internal.jobs.event, {
        type: 'inference',
        messageId,
        status: 'complete',
      })
    } catch (err) {
      await ctx.runMutation(internal.jobs.event, {
        type: 'inference',
        messageId,
        status: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
        data: err,
      })

      throw err
    }
  },
})

const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  name: z.string().optional(),
  content: z.string(),
})

const responseSchema = z.object({
  choices: z
    .object({
      message: z.object({
        content: z.string(),
      }),
    })
    .array()
    .min(1),
})
