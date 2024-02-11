import { v } from 'convex/values'
import z from 'zod'
import { api, internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { internalAction } from '../_generated/server'
import { assert } from '../util'

export const llm = internalAction({
  args: {
    id: v.id('jobs'),
  },
  handler: async (ctx, { id: jobId }): Promise<void> => {
    try {
      const jobRef = await ctx.runMutation(internal.jobs.acquire, {
        id: jobId,
        type: 'llm',
      })

      const messageId = jobRef as Id<'messages'>

      const messages = await ctx.runQuery(internal.threads.getMessageContext, {
        id: messageId,
      })

      const message = messages.pop()
      assert(message, 'llm target message missing')
      const { llmParameters } = message
      assert(llmParameters, 'llm parameters missing')

      const body = {
        ...llmParameters,
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

      await ctx.runMutation(api.threads.updateMessage, {
        id: messageId,
        role: 'assistant',
        content: m?.message.content ?? 'something is wrong',
      })

      await ctx.runMutation(internal.jobs.update, { id: jobId, status: 'complete' })
    } catch (err) {
      await ctx.runMutation(internal.jobs.update, {
        id: jobId,
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
