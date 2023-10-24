export const chatsConfig = [
  {
    id: 'p1',
    name: 'Piñata',
    endpoint: '/api/chat',
    modelId: 'openrouter::meta-llama/llama-2-70b-chat',
    parameters: {},
  },
  {
    id: 'g1',
    name: 'Gretchen',
    endpoint: '/api/chat',
    modelId: 'openai::gpt-4',
    parameters: {},
  },
  {
    id: 'e1',
    name: 'Ernest',
    endpoint: '/api/chat',
    modelId: 'openrouter::xwin-lm/xwin-lm-70b',
    parameters: {},
  },
  {
    id: 'h1',
    name: 'Hideko',
    endpoint: '/api/chat',
    modelId: 'openrouter::migtissera/synthia-70b',
    parameters: {},
  },
  {
    id: 'c1',
    name: 'Craig',
    endpoint: '/api/chat',
    modelId: 'openai::gpt-3.5-turbo',
    parameters: {},
  },
] as const
