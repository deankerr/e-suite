import { createOpenAI, openai } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'
import { v } from 'convex/values'
import * as vb from 'valibot'

import { internal } from '../../_generated/api'
import { internalMutation, internalQuery } from '../../functions'
import { ENV } from '../../lib/env'
import { ResourceKey } from '../../lib/valibot'
import { hasDelimiter } from '../../shared/helpers'
import { jobErrorHandling, WorkflowError } from '../helpers'
import { createJob } from '../jobs'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

const defaultMaxHistoryMessages = 64

export type ChatPipelineInput = vb.InferOutput<typeof InitialInput>
const InitialInput = vb.object({
  messageId: vb.pipe(
    vb.string(),
    vb.transform((input) => input as Id<'messages'>),
  ),
  resourceKey: vb.string(),
  excludeHistoryMessagesByName: vb.optional(vb.array(vb.string())),
  maxHistoryMessages: vb.optional(vb.number()),
  stream: vb.optional(vb.boolean()),
})

const createProvider = (endpoint: string) => {
  switch (endpoint) {
    case 'openai':
      return openai

    case 'together':
      return createOpenAI({
        apiKey: ENV.TOGETHER_API_KEY,
        baseURL: 'https://api.together.xyz/v1',
      })

    case 'openrouter':
      return createOpenAI({
        apiKey: ENV.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      })
  }

  throw new WorkflowError(`invalid endpoint: ${endpoint}`, 'invalid_endpoint', true)
}

export const chatPipeline: Pipeline = {
  name: 'chat',
  schema: InitialInput,
  steps: [
    {
      name: 'inference',
      retryLimit: 0,
      action: async (ctx, input) => {
        return jobErrorHandling(async () => {
          const {
            initial: {
              messageId,
              resourceKey,
              excludeHistoryMessagesByName,
              maxHistoryMessages,
              stream,
            },
          } = vb.parse(vb.object({ initial: InitialInput }), input)

          const { endpoint, modelId } = vb.parse(ResourceKey, resourceKey)

          const api = createProvider(endpoint)
          const model = api(modelId)

          const { messages } = await ctx.runQuery(
            internal.workflows.pipelines.chat.getConversationMessages,
            {
              messageId,
              excludeHistoryMessagesByName,
              maxHistoryMessages,
            },
          )
          console.log(`chat.${endpoint}.input`, model, messages, input)

          // * streaming generation
          if (stream) {
            const result = await streamText({
              model,
              messages,
              onFinish: async ({ text, finishReason, usage }) => {
                // * final message update
                await ctx.runMutation(internal.workflows.pipelines.chat.result, {
                  messageId,
                  text,
                })

                console.log(`chat.${endpoint}.output`, text, finishReason, usage)
              },
            })

            // * streamed text update
            let messageText = ''
            for await (const textPart of result.textStream) {
              messageText += textPart
              if (hasDelimiter(textPart)) {
                await ctx.runMutation(internal.workflows.pipelines.chat.stream, {
                  messageId,
                  text: messageText,
                })
              }
            }

            // * return job result
            return {
              text: await result.text,
              finishReason: await result.finishReason,
              usage: await result.usage,
            }
          } else {
            // * non-streaming generation
            const results = await generateText({
              model,
              messages,
            })
            const { text, finishReason, usage, ...output } = results
            console.log(`[chat] [${endpoint}] [output]`, text, finishReason, usage)

            await ctx.runMutation(internal.workflows.pipelines.chat.result, {
              messageId,
              text,
            })

            return { text, finishReason, usage, output }
          }
        }, 'chat.inference')
      },
    },
  ],
}

export const getConversationMessages = internalQuery({
  args: {
    messageId: v.id('messages'),
    excludeHistoryMessagesByName: v.optional(v.array(v.string())),
    maxHistoryMessages: v.optional(v.number()),
  },
  handler: async (ctx, { messageId, excludeHistoryMessagesByName, maxHistoryMessages }) => {
    const targetMessage = await ctx.table('messages').getX(messageId)

    const [name1 = null] = excludeHistoryMessagesByName ?? []

    const messages = await ctx.skipRules
      .table('messages', 'threadId', (q) =>
        q.eq('threadId', targetMessage.threadId).lt('_creationTime', targetMessage._creationTime),
      )
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.neq(q.field('text'), undefined),
          q.neq(q.field('name'), name1),
        ),
      )
      .take(maxHistoryMessages ?? defaultMaxHistoryMessages)
      .map((message) => {
        if (message.role === 'user') {
          return {
            role: message.role,
            name: message.name,
            content: message.text || '',
          }
        } else {
          return {
            role: message.role,
            content: message.text || '',
          }
        }
      })

    const thread = await ctx.skipRules.table('threads').getX(targetMessage.threadId)
    if (thread.instructions) {
      messages.push({
        role: 'system',
        content: thread.instructions,
      })
    }

    return {
      messages: messages.reverse(),
    }
  },
})

export const result = internalMutation({
  args: {
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)
    await message.patch({ text: args.text })

    // * thread title
    // TODO centralised check
    const thread = await message.edgeX('thread')
    if (!thread.title) {
      await createJob.generateThreadTitle(ctx, {
        threadId: thread._id,
      })
    }

    return message._id
  },
})

export const stream = internalMutation({
  args: {
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules.table('messages').getX(args.messageId).patch({ text: args.text })
  },
})
