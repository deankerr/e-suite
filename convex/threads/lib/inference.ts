'use node'

import { v } from 'convex/values'
import OpenAI from 'openai'
import { internal } from '../../_generated/api'
import { internalAction } from '../../_generated/server'
import { getTogetherAiApiKey } from '../../providers/togetherai'
import { assert } from '../../util'

const ai = () =>
  new OpenAI({
    apiKey: getTogetherAiApiKey(),
    baseURL: 'https://api.together.xyz/v1',
  })

const sendChat = async ({ prompt }: { prompt: string }) => {
  const chatCompletion = await ai().chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          "Create a concise, 3-5 word phrase as a title for the following conversation, strictly adhering to the 3-5 word limit and avoiding the use of the word 'title'. Respond with the title only, exactly as it should appear in a menu. Do not add any extra notes or explanations.",
      },
      { role: 'user', content: prompt },
    ],
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    max_tokens: 256,
  })

  const result = chatCompletion.choices[0]?.message.content
  assert(result, 'Chat completion is empty')

  return result
}

export const generateThreadTitle = internalAction({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.runQuery(internal.threads.threads.internalGet, {
      id: threadId,
    })
    assert(thread, 'Invalid thread id')

    // concat messages into single prompt
    const conversation = thread.messages
      .reverse()
      .reduce<string>((acc, curr) => acc.concat(`${curr.role}: ${curr.content}\n`), '')

    console.log({ prompt: conversation })
    const title = await sendChat({ prompt: conversation })
    console.log('title:', title)

    await ctx.runMutation(internal.threads.threads.internalUpdate, {
      id: threadId,
      fields: { title: title.trim(), permissions: thread.permissions },
    })

    return 0
  },
})
