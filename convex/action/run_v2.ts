import { generateText, streamText } from 'ai'
import { ConvexError, v } from 'convex/values'
import { ms } from 'itty-time'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { createAIProvider } from '../lib/ai'
import { ENV } from '../lib/env'
import { hasDelimiter } from '../shared/helpers'
import { getErrorMessage } from '../shared/utils'

import type { Id } from '../_generated/dataModel'
import type { ActionCtx } from '../_generated/server'

export const run = internalAction({
  args: {
    runId: v.id('runs_v2'),
  },

  handler: async (ctx, { runId }) => {
    try {
      const {
        stream,
        instructions = '',
        additionalInstructions = '',
        messages,
        model: { id: modelId, ...parameters },
        userId,
        messageId,
        patternId,
      } = await ctx.runMutation(internal.db.runs_v2.activate, { runId })

      const system = [instructions, additionalInstructions].join('\n\n').trim() || undefined

      console.log({
        stream,
        patternId,
        modelId,
        parameters,
        system: system?.slice(0, 500),
        messages: messages.map((message) => ({
          ...message,
          content: message.content.slice(0, 500),
        })),
      })

      const model = createAIProvider({ id: modelId })

      const input = {
        ...parameters,
        model,
        system,
        messages,
      }

      const { text, finishReason, usage, warnings, response, firstTokenAt } = stream
        ? await streamAIText(ctx, { runId, userId }, input)
        : await runAIText(input)

      console.log(text, { finishReason, usage, warnings })

      await ctx.runMutation(internal.db.runs_v2.complete, {
        runId,
        messageId,
        text,
        firstTokenAt,
        finishReason,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        modelId: response.modelId,
        requestId: response.id,
      })
    } catch (err) {
      console.error(err)

      await ctx.runMutation(internal.db.runs_v2.fail, {
        runId,
        errors: [{ message: getErrorMessage(err), code: 'unknown' }],
      })
    }
  },
})

async function runAIText(input: Parameters<typeof generateText>[0]) {
  const { text, finishReason, usage, warnings, response } = await generateText(input)
  return { text, finishReason, usage, warnings, response, firstTokenAt: undefined }
}

async function streamAIText(
  ctx: ActionCtx,
  run: { runId: Id<'runs_v2'>; userId: Id<'users'> },
  input: Parameters<typeof streamText>[0],
) {
  const textId = await ctx.runMutation(internal.db.texts.createMessageText, {
    runId: run.runId,
    userId: run.userId,
  })
  const result = await streamText(input)

  let firstTokenAt = 0
  let streamedText = ''
  for await (const textPart of result.textStream) {
    if (!textPart) continue
    if (!firstTokenAt) firstTokenAt = Date.now()
    streamedText += textPart
    if (hasDelimiter(textPart)) {
      await ctx.runMutation(internal.db.texts.streamToText, {
        textId,
        content: streamedText,
      })
    }
  }

  const [text, finishReason, usage, warnings, response] = await Promise.all([
    result.text,
    result.finishReason,
    result.usage,
    result.warnings,
    result.response,
  ])

  try {
    await ctx.scheduler.runAfter(ms('1 minute'), internal.db.texts.deleteText, {
      textId,
    })
  } catch (err) {
    console.error(err)
  }

  return { text, finishReason, usage, warnings, response, firstTokenAt }
}
