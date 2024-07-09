import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { filter } from 'convex-helpers/server/filter'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob } from '../jobs'
import { getChatConfig, hasDelimiter, insist } from '../shared/utils'

import type { Id } from '../_generated/dataModel'
import type { ActionCtx } from '../_generated/server'

const defaultMaxHistoryMessages = 20

export const start = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const { messageId } = await claimJob(ctx, args)
    const message = messageId ? await ctx.table('messages').getX(messageId) : null
    const chatConfig = getChatConfig(message?.inference)
    insist(message && chatConfig, 'invalid job inputs', {
      code: 'invalid_job',
      fatal: true,
    })

    const rawMessages = await filter(
      ctx.unsafeDb
        .query('messages')
        .withIndex('threadId', (q) =>
          q.eq('threadId', message.threadId).lt('_creationTime', message._creationTime),
        ),
      async (message) => {
        if (
          message.deletionTime ||
          !message.text ||
          (message.name && chatConfig.excludeHistoryMessagesByName?.includes(message.name))
        ) {
          return false
        }
        return true
      },
    )
      .order('desc')
      .take(chatConfig.maxHistoryMessages ?? defaultMaxHistoryMessages)

    const system = (await ctx.table('threads').getX(message.threadId)).instructions

    return {
      message,
      chatConfig,
      messages: rawMessages
        .map((message) => ({
          role: message.role,
          content: message.text || '',
        }))
        .reverse(),
      system,
    }
  },
})

export const run = internalAction({
  handler: async (ctx: ActionCtx, args: { jobId: Id<'jobs'> }) => {
    const { message, chatConfig, messages, system } = await ctx.runMutation(
      internal.inference.chatCompletionAi.start,
      { jobId: args.jobId },
    )

    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20240620'),
      system,
      messages,
      maxTokens: chatConfig.max_tokens,
      temperature: chatConfig.temperature,
      topP: chatConfig.top_p,
      frequencyPenalty: chatConfig.frequency_penalty,
      presencePenalty: chatConfig.presence_penalty,
    })

    let text = ''
    for await (const delta of result.textStream) {
      if (delta) {
        text += delta
        if (hasDelimiter(delta)) {
          await ctx.runMutation(internal.db.messages.streamText, {
            messageId: message._id,
            text,
          })
        }
      }
    }

    await ctx.runMutation(internal.inference.chatCompletionAi.complete, {
      jobId: args.jobId,
      messageId: message._id,
      text,
    })
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)
    await message.patch({ text: args.text })

    await completeJob(ctx, { jobId: args.jobId })
  },
})
