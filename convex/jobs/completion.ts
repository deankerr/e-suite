import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import OpenAI from 'openai'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { getEnv } from '../utils'

const createApi = (endpoint: string) => {
  switch (endpoint) {
    case 'together':
      return new OpenAI({
        apiKey: getEnv('TOGETHER_API_KEY'),
        baseURL: 'https://api.together.xyz/v1',
      })
  }

  throw new ConvexError('invalid endpoint') // todo no retry
}

export const chatCompletion = internalAction({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.runMutation(internal.jobs.interface.acquire, { jobId })
    const { messages, inference } = await ctx.runQuery(internal.threadsx.getChatCompletionContext, {
      messageId: job.messageId,
      take: 20,
    })
    const api = createApi(inference.endpoint)

    console.log(inference.type, inference.endpoint, inference.parameters)
    console.log(messages)

    const chatCompletion = await api.chat.completions.create({
      ...inference.parameters,
      messages,
      max_tokens: 256,
      stream: false,
    })

    console.log(chatCompletion)

    const content = chatCompletion.choices[0]?.message.content ?? '' //TODO check

    await ctx.runMutation(internal.jobs.interface.results, {
      jobId,
      status: 'complete',
      results: [{ type: 'message', value: content }],
    })
  },
})
