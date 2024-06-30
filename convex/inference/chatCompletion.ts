import { filter } from 'convex-helpers/server/filter'
import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, createJob, handleJobError, jobResultSuccess } from '../jobs'
import { createOpenAiClient } from '../lib/openai'
import { hasDelimiter, insist } from '../shared/utils'

const defaultMaxHistoryMessages = 20

const msgSchema = z.object({
  role: z.enum(['system', 'assistant', 'user']),
  name: z.string().optional(),
  content: z.string(),
})

export const init = internalMutation({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)
    const messageId = job.messageId
    insist(messageId, 'no messageId', { code: 'invalid_job_input' })

    const message = await ctx.table('messages').getX(messageId)
    const inference = message?.inference

    insist(
      inference && inference.type === 'chat-completion',
      'completion message lacks parameters',
      {
        code: 'invalid_job_input',
      },
    )

    const rawMessages = await filter(
      ctx.unsafeDb
        .query('messages')
        .withIndex('threadId', (q) => q.eq('threadId', message.threadId)),
      async (m) => {
        if (m.deletionTime !== undefined) return false
        if (m._creationTime > message._creationTime) return false
        if (!m.content) return false
        if (m.name && inference.excludeHistoryMessagesByName?.includes(m.name)) return false
        return true
      },
    )
      .order('desc')
      .take(inference.maxHistoryMessages ?? defaultMaxHistoryMessages)

    const messages = rawMessages.map((m) => msgSchema.parse(m))

    const thread = await ctx.table('threads').getX(message.threadId)
    if (thread.instructions) {
      messages.push({ role: 'system', content: thread.instructions })
    }

    return { message, messages: messages.toReversed(), inference }
  },
})

export const run = internalAction({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const input = await ctx.runMutation(internal.inference.chatCompletion.init, {
        jobId: args.jobId,
      })
      const { message, messages, inference } = input

      const { type, endpoint, endpointModelId, resourceKey, ...parameters } = inference
      const api = createOpenAiClient(endpoint)

      console.log(type, endpoint, parameters)
      console.log(messages)

      const nonStreaming = async () => {
        const chatCompletion = await api.chat.completions.create({
          ...parameters,
          model: endpointModelId,
          messages,
          stream: false,
        })

        console.log(chatCompletion)

        const content = chatCompletion.choices[0]?.message.content ?? '' //TODO check
        return content
      }

      const streaming = async () => {
        const stream = await api.chat.completions.create({
          ...parameters,
          model: endpointModelId,
          messages,
          stream: true,
        })

        let body = ''
        for await (const part of stream) {
          const text = part.choices[0]?.delta?.content
          if (text) {
            body += text
            if (hasDelimiter(text)) {
              await ctx.runMutation(internal.db.messages.streamCompletionContent, {
                messageId: message._id,
                content: body,
              })
            }
          }
        }

        return body
      }

      const isStreamingRequest = !!inference.stream
      const content = isStreamingRequest ? await streaming() : await nonStreaming()

      await ctx.runMutation(internal.inference.chatCompletion.complete, {
        jobId: args.jobId,
        messageId: message._id,
        text: content,
      })
    } catch (err) {
      return await handleJobError(ctx, { err, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: zid('jobs'),
    messageId: zid('messages'),
    text: z.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)
    await message.patch({ content: args.text })

    //* title generation
    const thread = await ctx.skipRules.table('threads').getX(message.threadId)
    if (!thread.title) {
      await createJob(ctx, 'inference/thread-title-completion', {
        threadId: message.threadId,
      })
    }
    await jobResultSuccess(ctx, { jobId: args.jobId })
  },
})
