import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob, handleJobError } from '../jobs'
import { insist } from '../shared/utils'

export const start = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    insist(job.threadId, 'required: threadId', { code: 'invalid_job' })

    const thread = await ctx.table('threads').getX(job.threadId)
    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', thread._id))
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.neq(q.field('content'), undefined),
          q.neq(q.field('role'), 'system'),
        ),
      )
      .take(4)
    insist(messages.length > 0, 'required: messages', { code: 'invalid_job' })

    return {
      job,
      threadId: thread._id,
      messages,
    }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const { job, threadId, messages } = await ctx.runMutation(
        internal.inference.threadTitleCompletion.start,
        args,
      )

      const message = prompt.replace(
        '%%%',
        messages
          .map((message) => message.content)
          .join('\n')
          .slice(0, 500),
      )

      console.log('[threadTitleCompletion] [input] [anthropic]', message)
      const response = await generateText({
        model: anthropic('claude-3-haiku-20240307'),
        prompt: message,
        maxTokens: 1024,
      })
      console.log('[threadTitleCompletion] [output] [anthropic]', response)

      const title = response.text.split('\n').at(-1)
      if (!title) {
        await ctx.runMutation(internal.jobs.fail, {
          jobId: job._id,
          jobError: {
            message: 'no title',
            code: 'invalid_response',
            fatal: false,
          },
        })
        return
      }

      await ctx.runMutation(internal.inference.threadTitleCompletion.complete, {
        jobId: job._id,
        threadId,
        title,
      })
    } catch (error) {
      await handleJobError(ctx, { jobId: args.jobId, error })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    threadId: v.id('threads'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.skipRules.table('threads').getX(args.threadId).patch({ title: args.title })
    await completeJob(ctx, args)
  },
})

const prompt = `
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
