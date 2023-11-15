// combined model info
const models = {
  id: 'mistralai/Mistral-7B-v0.1', // OR -> id, TAI -> name
  displayName: 'Mistral (7B)', // OR -> name, TAI -> display_name
  type: 'chat', // TAI -> display_type (sort of) chat/completion/image etc.
  category: 'code', // TAI -> display_type
  description: 'outperforms llama etc...', // TAI -> description
  descriptionLink: '?', // TAI
  link: '?', // TAI
  license: 'Apache-2', // TAI
  creator: 'mistralai', // TAI -> creator_organization
  contextLength: '4096', // TAI/OR context_length

  tokenizer: 'mistral', // OR -> architecture.tokenizer
  instructType: 'alpaca', // OR -> architecture.instruct_type
  promptFormat: '[INST] {prompt} [/INST]',
  stop: ['</s>', '[INST]'], // TAI -> config.stop
  // moderated -> is openai/anthropic
}

export type ModelMergedDef = {
  id: string
  displayName: string
  category: string
  description: string
  descriptionLink: string
  link: string
  license: string
  creator: string
  parameterSize: string
  contextLength: string
  tokenizer: string
  instructType: string
  promptFormat: string
  stop: string[]
}

export const modelMainTypes = [
  'chat',
  'completion',
  'instruct',
  'image',
  'textToSpeech',
  'speechToText',
  'embedding',
] as const
