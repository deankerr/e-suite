import { EChatEngine } from './schemas'

const engines: EChatEngine[] = [
  {
    id: 'openai::gpt-3.5-turbo',
    type: 'chat',
    platform: 'openai',
    model: 'gpt-3.5-turbo',
    contextLength: 4097,
    messages: true,
    prompt: false,
    metadata: {
      label: 'OpenAI: GPT-3.5 Turbo',
      creator: 'OpenAI',
      description:
        'Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration 2 weeks after it is released.',
      licence: 'OpenAI',
    },
    input: { model: 'gpt-3.5-turbo', stream: true },
  },
  {
    id: 'openrouter::meta-llama/llama-2-70b-chat',
    type: 'chat',
    platform: 'openrouter',
    model: 'llama-2-70b-chat',
    contextLength: 4096,
    messages: true,
    prompt: true,
    metadata: {
      label: 'Meta: Llama v2 70B Chat',
      creator: 'Meta',
      description:
        'Llama 2-chat leverages publicly available instruction datasets and over 1 million human annotations. Available in three sizes: 7B, 13B and 70B parameters',
      licence: 'LLaMA license Agreement (Meta)',
    },
    input: { model: 'meta-llama/llama-2-70b-chat', stream: true },
  },
  {
    id: 'togetherai::togethercomputer/redpajama-incite-7b-chat',
    type: 'chat',
    platform: 'togetherai',
    model: 'RedPajama-INCITE-7B-Chat',
    contextLength: 2048,
    messages: false,
    prompt: true,
    metadata: {
      label: 'Together.ai: RedPajama INCITE 7B Chat',
      creator: 'Together.ai',
      description:
        'Chat model fine-tuned using data from Dolly 2.0 and Open Assistant over the RedPajama-INCITE-Base-7B-v1 base model.',
      licence: 'apache-2.0',
    },
    input: { model: 'togethercomputer/RedPajama-INCITE-7B-Chat' },
  },
]

export function getEngines() {
  return engines
}

export function getEngineById(id: string) {
  const engine = engines.find((e) => e.id === id)
  if (!engine) throw new Error('Unknown engineID: ' + id)
  return engine
}

// const chatModels = [
//   {
//     id: 'openai::gpt-4',
//     provider: 'openai',
//     label: 'OpenAI: GPT-4',
//     parameters: { model: 'gpt-4' },
//   },
//   {
//     id: 'openrouter::jondurbin/airoboros-l2-70b',
//     provider: 'openrouter',
//     label: 'Airoboros L2 70B',
//     parameters: { model: 'jondurbin/airoboros-l2-70b' },
//   },
//   {
//     id: 'openrouter::migtissera/synthia-70b',
//     provider: 'openrouter',
//     label: 'Synthia 70B',
//     parameters: { model: 'migtissera/synthia-70b' },
//   },
//   {
//     id: 'openrouter::xwin-lm/xwin-lm-70b',
//     provider: 'openrouter',
//     label: 'Xwin 70B',
//     parameters: { model: 'xwin-lm/xwin-lm-70b' },
//   },
// ] as const
