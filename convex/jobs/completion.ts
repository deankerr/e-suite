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
    const job = await ctx.runMutation(internal.jobs.manage.acquire, { jobId })
    const { messages, inference } = await ctx.runQuery(
      internal.threads.internal.getChatCompletionContext,
      {
        messageId: job.messageId,
        take: 20,
      },
    )
    const api = createApi(inference.endpoint)

    console.log(inference.type, inference.endpoint, inference.parameters)
    console.log(messages)

    const chatCompletion = await api.chat.completions.create({
      ...inference.parameters,
      messages,
      max_tokens: 2048,
      stream: false,
    })

    console.log(chatCompletion)

    const content = chatCompletion.choices[0]?.message.content ?? '' //TODO check

    await ctx.runMutation(internal.jobs.manage.results, {
      jobId,
      status: 'complete',
      results: [{ type: 'message', value: content }],
    })
  },
})

export const titleCompletion = internalAction({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.runMutation(internal.jobs.manage.acquire, { jobId })
    const { messages } = await ctx.runQuery(internal.threads.internal.getTitleCompletionContext, {
      threadId: job.threadId,
      take: 4,
    })
    const api = createApi('together')

    // console.log('textToImage', 'together')
    // console.log(messages)
    const summary = messages
      .map((message) => message.content)
      .join('\n')
      .slice(-500)
    const message = titleMessage.replace('%%%', summary)
    console.log('title-completion', message)

    const chatCompletion = await api.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: message,
        },
        ...messages,
      ],
      max_tokens: 1024,
      model: 'meta-llama/Llama-3-70b-chat-hf',
      stream: false,
    })

    console.log(chatCompletion)

    const content = chatCompletion.choices[0]?.message.content ?? '' //TODO check
    const title = content.split('\n').at(-1) ?? '<title?>'

    await ctx.runMutation(internal.jobs.manage.results, {
      jobId,
      status: 'complete',
      results: [{ type: 'message', value: title }],
    })
  },
})

const titleMessage = `
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
