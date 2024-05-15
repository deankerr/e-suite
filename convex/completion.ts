import { zid } from 'convex-helpers/server/zod'
import OpenAI from 'openai'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalAction, internalMutation } from './functions'
import { completionJobFields, completionJobResultFields } from './schema'
import { insist } from './utils'

import type { Id } from './_generated/dataModel'
import type { MutationCtx } from './types'

export const createCompletionJob = async (
  ctx: MutationCtx,
  params: {
    parameters: z.infer<(typeof completionJobFields)['parameters']>
    messageId: Id<'messages'>
  },
) => {
  const completionJobId = await ctx.table('completion_jobs').insert({ ...params, status: 'queue' })
  await ctx.scheduler.runAfter(0, internal.completion.run, { completionJobId })
}

export const acquire = internalMutation({
  args: {
    completionJobId: zid('completion_jobs'),
  },
  handler: async (ctx, { completionJobId }) => {
    const job = await ctx.table('completion_jobs').getX(completionJobId)
    insist(job.status === 'queue', 'invalid job status')
    await job.patch({ status: 'active' })

    return job
  },
})

export const result = internalMutation({
  args: {
    completionJobId: zid('completion_jobs'),
    status: z.enum(['complete', 'failed']),
    result: completionJobResultFields,
  },
  handler: async (ctx, { completionJobId, status, result }) => {
    const job = await ctx.table('completion_jobs').getX(completionJobId)
    await job.patch({ status, result })

    if (result.type === 'chatCompletion') {
      await ctx.table('messages').getX(job.messageId).patch({ text: result.items[0] })
    }
    return job
  },
})

export const run = internalAction({
  args: {
    completionJobId: zid('completion_jobs'),
  },
  handler: async (ctx, { completionJobId }) => {
    const { parameters, messageId } = await ctx.runMutation(internal.completion.acquire, {
      completionJobId,
    })

    const messages = await ctx.runQuery(internal.deprecated.messages.getContext, {
      messageId,
    })

    console.log(parameters, messages)

    const openai = new OpenAI({
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: 'https://api.together.xyz/v1',
    })

    const chatCompletion = await openai.chat.completions.create({
      ...parameters,
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      max_tokens: 256,
      stream: false,
    })
    console.log(chatCompletion)

    const text = chatCompletion.choices[0]?.message.content ?? '' //TODO check

    // insist(text !== undefined, 'response is empty')

    await ctx.runMutation(internal.completion.result, {
      completionJobId,
      status: 'complete',
      result: {
        type: 'chatCompletion',
        items: [text, JSON.stringify(chatCompletion)],
      },
    })
  },
})
