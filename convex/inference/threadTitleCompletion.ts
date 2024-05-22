import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, handleJobError, jobResultSuccess } from '../jobs/runner'
import { createOpenAiClient } from '../lib/openai'
import { insist } from '../shared/utils'

import type { Id } from '../_generated/dataModel'
import type { MutationCtx } from '../types'

const msgSchema = z.object({
  role: z.enum(['system', 'assistant', 'user']),
  name: z.string().optional(),
  content: z.string(),
})

export const threadTitleCompletion = {
  name: 'inference/thread-title-completion' as const,
  required: {
    threadId: true,
  },
  inputValidator: z.object({ threadId: zid('threads') }),

  output: async (ctx: MutationCtx, args: { threadId: Id<'threads'>; title: string }) => {
    await ctx.skipRules.table('threads').getX(args.threadId).patch({ title: args.title })
  },
}

export const init = internalMutation({
  args: {
    jobId: zid('jobs_beta'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)

    const threadId = job.threadId
    insist(threadId, 'threadId missing', { code: 'invalid_job_input' })

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.neq(q.field('content'), undefined),
          q.neq(q.field('role'), 'system'),
          q.neq(q.field('content'), undefined),
        ),
      )
      .take(4)
      .map((message) => msgSchema.parse(message))

    return { threadId, messages: messages.toReversed() }
  },
})

export const run = internalAction({
  args: {
    jobId: zid('jobs_beta'),
  },
  handler: async (ctx, { jobId }) => {
    try {
      const input = await ctx.runMutation(internal.inference.threadTitleCompletion.init, { jobId })

      const api = createOpenAiClient(endpoint)

      const message = titleMessage.replace(
        '%%%',
        input.messages
          .map((message) => message.content)
          .join('\n')
          .slice(0, 500),
      )

      const body = {
        messages: [
          {
            role: 'system' as const,
            content: message,
          },
        ],
        max_tokens: 1024,
        model: 'meta-llama/Llama-3-8b-chat-hf',
        stream: false as const,
      }
      console.log('title-completion', 'together', body)

      const chatCompletion = await api.chat.completions.create(body)
      console.log(chatCompletion)

      const content = chatCompletion.choices[0]?.message.content ?? '' //TODO check
      const title = content.split('\n').at(-1) ?? '<title?>'
      await ctx.runMutation(internal.inference.threadTitleCompletion.complete, {
        jobId,
        threadId: input.threadId,
        title,
      })
    } catch (err) {
      return await handleJobError(ctx, { err, jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: zid('jobs_beta'),
    threadId: zid('threads'),
    title: z.string(),
  },
  handler: async (ctx, { jobId, threadId, title }) => {
    await ctx.skipRules.table('threads').getX(threadId).patch({ title })
    await jobResultSuccess(ctx, { jobId })
  },
})

const endpoint = 'together'
const titleMessage = `
The following messages are from the start of a conversation that a user has just initiated with
another large language model. Your task is to create a succinct and concise summary of the
conversation so far, and create a title for the conversation, which is no more than 6 words.
It is critically important that you do not add any extra notes or explanations to the title, as this
will cause an overflow of the title text and make it difficult for the user to understand what the
title is about. Add any extra notes in the summary section instead.

<BEGIN MESSAGE HISTORY>
%%%
<END MESSAGE HISTORY>

Your response should be in this format:

# Summary
(your summary here)

# Title
(your title here)
`
