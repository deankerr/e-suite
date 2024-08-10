import { asyncMap } from 'convex-helpers'

import { internalMutation } from '../functions'

const tagData = [
  {
    tag: 'base',
    score: -30,
    includes: ['base'],
  },
  {
    tag: 'free',
    score: 1,
    includes: ['free'],
  },
  {
    tag: 'frontier',
    score: 30,
    includes: ['gpt-4o', 'claude-3.5', 'gemini-pro-1.5', 'llama-3.1', 'mistral-large', 'yi-large'],
  },
  {
    tag: 'high',
    score: 20,
    includes: [
      'gpt-4',
      'claude-3',
      'gemini',
      'llama-3',
      'mistral',
      'mixtral',
      'yi',
      'qwen',
      'deepseek',
      'command',
    ],
  },
  {
    tag: 'finetune',
    score: 10,
    includes: ['nous', 'dolphin', 'wizardlm-2'],
  },
  {
    tag: 'roleplay',
    score: -1,
    includes: [
      'mytho',
      'lumimaid',
      'noromaid',
      'psyfighter',
      'slerp',
      'lzlv',
      'fimbulvetr',
      'rose',
      'toppy',
      'weaver',
    ],
  },
  {
    tag: 'exotic',
    score: -5,
    includes: ['stripedhyena', 'rwkv'],
  },
  {
    tag: 'legacy',
    score: -10,
    includes: ['gpt-3.5', 'palm', 'claude-1', 'claude-2', 'claude-instant'],
  },
]

export const getModelTag = (model: { name: string; endpointModelId: string }) => {
  if (model.name.toLowerCase().includes('base')) {
    return { tag: 'base', score: -30 }
  }

  for (const { tag, score, includes } of tagData) {
    if (includes.find((val) => model.endpointModelId.toLowerCase().includes(val))) {
      return { tag, score }
    }
  }
}

export const tagAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.table('chat_models')

    await asyncMap(models, async (model) => {
      const tagScore = getModelTag(model)
      if (tagScore) {
        await model.patch({ tags: [tagScore.tag], internalScore: tagScore.score })
      }
    })
  },
})
