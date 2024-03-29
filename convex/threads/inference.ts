'use node'

import { v } from 'convex/values'
import OpenAI from 'openai'
import z from 'zod'

import { internal } from '../_generated/api'
import { internalAction } from '../_generated/server'
import { createTextToSpeechRequest as awsCreateTextToSpeechRequest } from '../providers/aws'
import { createTextToSpeechRequest as elevenlabsCreateTextToSpeechRequest } from '../providers/elevenlabs'
import { getTogetherAiApiKey } from '../providers/togetherai'
import { assert } from '../util'

const ai = () =>
  new OpenAI({
    apiKey: getTogetherAiApiKey(),
    baseURL: 'https://api.together.xyz/v1',
  })

export const generateThreadTitle = internalAction({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, { threadId }): Promise<void> => {
    const thread = await ctx.runQuery(internal.threads.threads.internalGet, {
      id: threadId,
    })
    assert(thread, 'Invalid thread id')

    // concat messages into single prompt
    const conversation = thread.messages
      .reverse()
      .reduce<string>((acc, curr) => acc.concat(`${curr.role}: ${curr.content}\n`), '')
      .trim()

    const prompt = `You are a summarization system that can provide summaries of a conversation. In clear and concise language, provide a short summary of the following conversation.
    Afterward, create a 3 to 6 word title for the conversation, strictly adhering to the word limit and avoiding use of the words 'title' or 'user'. Enclose the title in <<<>>>.
    
    # Conversation
    ${conversation}

    # Summary`

    console.log({ prompt })
    const response = await ai().completions.create({
      prompt,
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
    })

    const result = response.choices[0]?.text
    console.log(result)

    const title = result?.match(/<<<(.*)>>>/)?.[1]
    assert(title, 'Invalid title')

    await ctx.runMutation(internal.threads.threads.internalUpdate, {
      id: threadId,
      fields: { title: title.trim(), permissions: thread.permissions },
    })
  },
})

export const chat = internalAction({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, { messageId }): Promise<void> => {
    try {
      const messages = await ctx.runQuery(internal.threads.threads.getMessageContext, {
        id: messageId,
      })

      const message = messages.pop()
      assert(message, 'inference target message missing')
      const inferenceParameters =
        'inferenceParameters' in message ? message.inferenceParameters : null
      assert(inferenceParameters, 'inference parameters missing')

      const body = {
        ...inferenceParameters,
        n: 1,
        messages: messageSchema.array().parse(messages),
      }
      console.log(body)

      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.TOGETHERAI_API_KEY}`,
        },
        body: JSON.stringify(body),
      })
      const json = await response.json()

      console.log('response', json)
      const {
        choices: [m],
      } = responseSchema.parse(json)

      await ctx.runMutation(internal.threads.threads.streamMessageContent, {
        id: messageId,
        content: m?.message.content ?? '{{ Response missing? }}',
      })

      await ctx.runMutation(internal.jobs.event, {
        type: 'inference',
        messageId,
        status: 'complete',
      })
    } catch (err) {
      await ctx.runMutation(internal.jobs.event, {
        type: 'inference',
        messageId,
        status: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
        data: err,
      })

      throw err
    }
  },
})

const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  name: z.string().optional(),
  content: z.string(),
})

const responseSchema = z.object({
  choices: z
    .object({
      message: z.object({
        content: z.string(),
      }),
    })
    .array()
    .min(1),
})

export const voice = internalAction({
  args: {
    voiceoverId: v.id('voiceovers'),
  },
  handler: async (ctx, { voiceoverId }) => {
    try {
      const { text, provider, parameters } = await ctx.runQuery(
        internal.threads.threads.getVoiceoverParameters,
        {
          voiceoverId,
        },
      )

      const createTextToSpeechRequest = {
        elevenlabs: elevenlabsCreateTextToSpeechRequest,
        aws: awsCreateTextToSpeechRequest,
      }

      const blob = await createTextToSpeechRequest[provider]({ text, parameters })
      const storageId = await ctx.storage.store(blob)

      await ctx.runMutation(internal.threads.threads.updateVoiceoverStorageId, {
        voiceoverId,
        storageId,
      })

      await ctx.runMutation(internal.jobs.event, {
        type: 'voiceover',
        voiceoverId,
        status: 'complete',
      })
    } catch (err) {
      await ctx.runMutation(internal.jobs.event, {
        type: 'voiceover',
        voiceoverId,
        status: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
        data: err instanceof Error ? JSON.stringify(err) : undefined,
      })

      throw err
    }
  },
})
