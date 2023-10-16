import type { ChatInferenceParameters, ChatSession } from './types'

const defaultParameters: ChatInferenceParameters = {
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  stream: true,
  stop: ['### USER:', 'duran duran'],
}

const defaultApi = {
  endpoint: '/api/chat',
}

export const initialChatsConfig: ChatSession[] = [
  {
    id: 'G2',
    api: defaultApi,
    panel: { title: 'Gretchen', active: false },
    parameters: { ...defaultParameters },
  },
  {
    id: 'P1',
    api: defaultApi,
    panel: { title: 'Piñata', active: true },
    parameters: {
      ...defaultParameters,
      provider: 'openrouter',
      model: 'meta-llama/llama-2-70b-chat',
    },
  },
  {
    id: 'H3',
    api: defaultApi,
    panel: { title: 'Hideko', active: false },
    parameters: { ...defaultParameters, provider: 'openrouter', model: 'migtissera/synthia-70b' },
  },

  {
    id: 'E4',
    api: defaultApi,
    panel: { title: 'Ernest', active: false },
    parameters: { ...defaultParameters, provider: 'openrouter', model: 'xwin-lm/xwin-lm-70b' },
  },
]
