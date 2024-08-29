import { generateText, streamText } from 'ai'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { createAi } from '../lib/ai'
import { runConfigChatV } from '../schema'
import { hasDelimiter } from '../shared/helpers'

export const run = internalAction({
  args: {
    messageId: v.id('messages'),
    runConfig: runConfigChatV,
  },
  handler: async (ctx, { messageId, runConfig }) => {
    const { model } = createAi(runConfig.resourceKey)

    const messages = await ctx.runQuery(internal.db.threads.getConversation, {
      messageId,
      limit: runConfig.maxHistoryMessages,
    })

    const input = {
      model,
      messages,
      maxTokens: runConfig.max_tokens,
      temperature: runConfig.temperature,
      topP: runConfig.top_p,
      topK: runConfig.top_k,
      presencePenalty: runConfig.presence_penalty,
      frequencyPenalty: runConfig.frequency_penalty,
      stopSequences: runConfig.stop,
    }

    if (runConfig.stream) {
      // * stream
      const result = await streamText({
        ...input,
        onFinish: async ({ text, finishReason, usage }) => {
          console.log(text, finishReason, usage)
          // * final message update
          await ctx.runMutation(internal.db.messages.updateSR, {
            messageId,
            text,
            role: 'assistant',
          })
        },
      })

      // * streamed text update
      let messageText = ''
      for await (const textPart of result.textStream) {
        messageText += textPart
        if (hasDelimiter(textPart)) {
          await ctx.runMutation(internal.db.messages.streamText, {
            messageId,
            text: messageText,
          })
        }
      }
    } else {
      // * non-stream
      const { text, finishReason, usage } = await generateText(input)
      console.log(text, finishReason, usage)

      await ctx.runMutation(internal.db.messages.updateSR, {
        messageId,
        text,
        role: 'assistant',
      })
    }

    // * update thread title
    const message = await ctx.runQuery(internal.db.messages.getDoc, {
      messageId,
    })
    if (!message) return

    const thread = await ctx.runQuery(internal.db.threads.getDoc, {
      slugOrId: message.threadId,
    })
    if (!thread) return

    if (!thread.title) {
      await ctx.scheduler.runAfter(0, internal.action.generateThreadTitle.run, {
        messageId,
      })
    }
  },
})
