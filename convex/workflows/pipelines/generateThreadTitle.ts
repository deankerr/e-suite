import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { v } from 'convex/values'
import * as vb from 'valibot'

import { internal } from '../../_generated/api'
import { internalMutation, internalQuery } from '../../functions'
import { jobErrorHandling, WorkflowError } from '../engine'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

export type GenerateThreadTitlePipelineInput = vb.InferOutput<typeof InitialInput>
const InitialInput = vb.object({
  threadId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'threads'>),
  ),
})

export const generateThreadTitlePipeline: Pipeline = {
  name: 'generateThreadTitle',
  schema: InitialInput,
  steps: [
    {
      name: 'inference',
      retryLimit: 3,
      action: async (ctx, input) => {
        return jobErrorHandling(async () => {
          const {
            initial: { threadId },
          } = vb.parse(vb.object({ initial: InitialInput }), input)

          const messages = await ctx.runQuery(
            internal.workflows.pipelines.generateThreadTitle.getMessages,
            {
              threadId,
            },
          )

          const message = prompt.replace(
            '%%%',
            messages
              .map((message) => `${message.role}: ${message.text}`)
              .join('\n')
              .slice(0, 800),
          )

          console.log('generateThreadTitle/openai/input', message)
          const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            prompt: message,
            maxTokens: 1024,
          })
          console.log('generateThreadTitle/openai/output', text)

          const title = text.split('\n').at(-1)
          if (!title) {
            throw new WorkflowError('title is missing', 'title_missing', true)
          }

          await ctx.runMutation(internal.workflows.pipelines.generateThreadTitle.result, {
            threadId,
            title,
          })

          return { title }
        }, 'generateThreadTitle.inference')
      },
    },
  ],
}

export const getMessages = internalQuery({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.skipRules.table('threads').getX(args.threadId)
    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.neq(q.field('text'), undefined),
          q.neq(q.field('role'), 'system'),
        ),
      )
      .take(4)

    return messages
  },
})

export const result = internalMutation({
  args: {
    threadId: v.id('threads'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules.table('threads').getX(args.threadId).patch({ title: args.title })
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
