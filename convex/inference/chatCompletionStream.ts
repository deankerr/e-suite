import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, handleJobError, jobResultSuccess } from '../jobs/runner'
import { createOpenAiClient } from '../lib/openai'
import { hasDelimiter, insist } from '../shared/utils'

import type { Ent } from '../types'

const temp_config_messageHistory = 20

const msgSchema = z.object({
  role: z.enum(['system', 'assistant', 'user']),
  name: z.string().optional(),
  content: z.string(),
})

export const init = internalMutation({
  args: {
    jobId: zid('jobs_beta'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await acquireJob(ctx, jobId)
    insist(job.messageId, 'no messageId', { code: 'invalid_job_input' })

    const message: Ent<'messages'> = await ctx.table('messages').getX(job.messageId)
    const inference = message?.inference

    insist(
      inference && inference.type === 'chat-completion',
      'completion message lacks parameters',
      { code: 'invalid_job_input' },
    )

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', message.threadId))
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.lt(q.field('_creationTime'), message._creationTime),
          q.neq(q.field('content'), undefined),
        ),
      )
      .take(temp_config_messageHistory)
      .map((message) => msgSchema.parse(message))

    return { message, messages: messages.toReversed(), inference }
  },
})

export const run = internalAction({
  args: {
    jobId: zid('jobs_beta'),
  },
  handler: async (ctx, args) => {
    try {
      const input = await ctx.runMutation(internal.inference.chatCompletionStream.init, {
        jobId: args.jobId,
      })

      const { message, messages, inference } = input

      const api = createOpenAiClient(inference.endpoint)

      console.log(inference.type, inference.endpoint, inference.parameters)
      console.log(messages)

      const stream = await api.chat.completions.create({
        ...inference.parameters,
        messages,
        max_tokens: 2048,
        stream: true,
      })

      let body = ''
      for await (const part of stream) {
        const text = part.choices[0]?.delta?.content
        if (text) {
          body += text
          if (hasDelimiter(text)) {
            await ctx.runMutation(internal.threads.mutate.updateMessage, {
              messageId: message._id,
              text: body,
            })
          }
        }
      }

      await ctx.runMutation(internal.inference.chatCompletionStream.complete, {
        jobId: args.jobId,
        messageId: message._id,
        text: body,
      })
    } catch (err) {
      return await handleJobError(ctx, { err, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: zid('jobs_beta'),
    messageId: zid('messages'),
    text: z.string(),
  },
  handler: async (ctx, args) => {
    await ctx.skipRules.table('messages').getX(args.messageId).patch({ content: args.text })
    await jobResultSuccess(ctx, { jobId: args.jobId })
  },
})
