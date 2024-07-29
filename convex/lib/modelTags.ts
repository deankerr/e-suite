export function getModelTags(modelId: string) {
  const { tags, score } = tagDefs.reduce(
    (acc, tag) => {
      if (tag.includes.includes(modelId)) {
        acc.tags.push(tag.tag)
        acc.score += tag.score
      }
      return acc
    },
    { tags: [] as string[], score: 0 },
  )

  return { tags, score }
}

const tagDefs = [
  {
    tag: 'flagship',
    includes: [
      'gpt-4o',
      'claude-3',
      'command',
      'gemini',
      'llama-3',
      'mixtral',
      'mistral',
      'qwen-2',
    ],
    score: 10,
  },
  {
    tag: 'multimodal',
    includes: ['gpt-4o', 'gpt-4-turbo', 'vision', 'llava', 'gemini', 'claude-3'],
    score: 5,
  },

  { tag: 'online', includes: ['online'], score: 1 },
  { tag: 'free', includes: ['free'], score: -1 },
  { tag: 'code', includes: ['code'], score: -1 },
  {
    tag: 'roleplay',
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
    score: -1,
  },
  { tag: 'legacy', includes: ['gpt-3.5', 'palm-2', 'claude-2', 'claude-instant'], score: -10 },
  { tag: 'vintage', includes: ['alpaca'], score: -10 },
]
