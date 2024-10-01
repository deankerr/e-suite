import { createOpenAI, openai } from '@ai-sdk/openai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText, streamText } from 'ai'
import { omit } from 'convex-helpers'
import { ConvexError, v } from 'convex/values'
import { ms } from 'itty-time'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { ENV } from '../lib/env'
import { hasDelimiter } from '../shared/helpers'
import { getErrorMessage } from '../shared/utils'

function createModelProvider(model: { provider: string; id: string }) {
  switch (model.provider) {
    case 'openai':
      return openai(model.id)
    case 'openrouter':
      return createOpenRouter({
        headers: {
          'HTTP-Referer': `https://${ENV.APP_HOSTNAME}`,
          'X-Title': `esuite`,
        },
      })(model.id)
    case 'together':
      return createOpenAI({
        apiKey: ENV.TOGETHER_API_KEY,
        baseURL: 'https://api.together.xyz/v1',
      })(model.id)
    default:
      throw new ConvexError(`invalid provider: ${model.provider}`)
  }
}

export const run = internalAction({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    try {
      const { run, messages } = await ctx.runMutation(internal.db.runs.activate, { runId })
      const model = createModelProvider(run.model)

      const input = {
        ...run.modelParameters,
        model,
        system: run.instructions,
        messages,
      }
      console.log(input)

      async function nonStreaming() {
        const { text, finishReason, usage, warnings, response, responseMessages } =
          await generateText({ ...input })
        return { text, finishReason, usage, warnings, response, responseMessages }
      }

      async function streaming() {
        const textId = await ctx.runMutation(internal.db.texts.createMessageText, {
          runId,
          userId: run.userId,
        })
        const result = await streamText(input)

        let streamedText = ''
        for await (const textPart of result.textStream) {
          streamedText += textPart
          if (hasDelimiter(textPart)) {
            await ctx.runMutation(internal.db.texts.streamToText, {
              textId,
              content: streamedText,
            })
          }
        }

        const [text, finishReason, usage, warnings, response, responseMessages] = await Promise.all(
          [
            result.text,
            result.finishReason,
            result.usage,
            result.warnings,
            result.response,
            result.responseMessages,
          ],
        )

        try {
          await ctx.scheduler.runAfter(ms('1 minute'), internal.db.texts.deleteText, {
            textId,
          })
        } catch (err) {
          console.error(err)
        }

        return { text, finishReason, usage, warnings, response, responseMessages }
      }

      const { text, finishReason, usage, warnings, response, responseMessages } = run.stream
        ? await streaming()
        : await nonStreaming()

      console.log(responseMessages, { finishReason }, usage, omit(response, ['headers']))
      if (warnings) warnings.forEach((warning) => console.warn(warning))

      await ctx.runMutation(internal.db.runs.complete, {
        runId,
        text,
        finishReason,
        usage,
      })
    } catch (err) {
      console.error(err)
      await ctx.runMutation(internal.db.runs.fail, {
        runId,
        errors: [getErrorMessage(err)],
      })
    }
  },
})
