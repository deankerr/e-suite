import { createOpenAI, openai } from '@ai-sdk/openai'
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
      return createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: ENV.OPENROUTER_API_KEY,
        headers: {
          'HTTP-Referer': `https://${ENV.APP_HOSTNAME}`,
          'X-Title': `esuite`,
        },
        compatibility: 'strict',
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
  handler: async (ctx, { runId }): Promise<void> => {
    try {
      const { run, messages, threadInstructions } = await ctx.runMutation(
        internal.db.runs.activate,
        { runId },
      )
      console.log({ ...run, messages })

      const model = createModelProvider(run.model)
      const input = {
        ...run.modelParameters,
        model,
        system: run.instructions ?? threadInstructions,
        messages,
      }

      async function nonStreaming() {
        const { text, finishReason, usage, warnings, response } = await generateText({ ...input })
        return { text, finishReason, usage, warnings, response }
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

        return { text, finishReason, usage, warnings, response }
      }

      const { text, finishReason, usage, warnings, response } = run.stream
        ? await streaming()
        : await nonStreaming()

      console.log(text)
      console.log({ finishReason, usage, response: omit(response, ['headers']) })
      if (warnings) warnings.forEach((warning) => console.warn(warning))

      await ctx.runMutation(internal.db.runs.complete, {
        runId,
        text,
        finishReason,
        usage,
      })

      if (run.model.provider === 'openrouter') {
        await ctx.scheduler.runAfter(1000, internal.action.run.fetchOpenRouterMetadata, {
          runId,
          responseId: response.id,
        })
      }
    } catch (err) {
      console.error(err)

      await ctx.runMutation(internal.db.runs.fail, {
        runId,
        errors: [getErrorMessage(err)],
      })
    }
  },
})

export const fetchOpenRouterMetadata = internalAction({
  args: {
    runId: v.id('runs'),
    responseId: v.string(),
    attempt: v.optional(v.number()),
  },
  handler: async (ctx, { runId, responseId, attempt = 1 }): Promise<void> => {
    try {
      const response = await fetch(`https://openrouter.ai/api/v1/generation?id=${responseId}`, {
        headers: {
          Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
        },
      })

      const json = await response.json()
      console.log('openrouter metadata', responseId, runId, attempt, json)

      if ('data' in json) {
        await ctx.runMutation(internal.db.runs.updateProviderMetadata, {
          runId,
          providerMetadata: json.data,
        })
        return
      }

      if ('error' in json) {
        throw new ConvexError(json.error.message)
      }

      throw new ConvexError('invalid openrouter response')
    } catch (err) {
      if (attempt > 5) {
        throw err
      }

      console.error(err)
      await ctx.scheduler.runAfter(2000 * attempt, internal.action.run.fetchOpenRouterMetadata, {
        runId,
        responseId,
        attempt: attempt + 1,
      })
    }
  },
})
