import type { ChatInferenceParameters, ChatSession } from './types'

const defaultParameters: ChatInferenceParameters = {
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  stream: true,
}

const defaultApi = {
  endpoint: '/api/chat',
}

export const chatsConfig: ChatSession[] = [
  {
    id: 'G2',
    api: defaultApi,
    panel: { title: 'Gretchen', active: false },
    parameters: { ...defaultParameters },
  },
  {
    id: 'H3',
    api: defaultApi,
    panel: { title: 'Hideko', active: true },
    parameters: { ...defaultParameters },
  },
  {
    id: 'P1',
    api: defaultApi,
    panel: { title: 'Piñata', active: false },
    parameters: { ...defaultParameters },
  },
  {
    id: 'E4',
    api: defaultApi,
    panel: { title: 'Ernest', active: false },
    parameters: { ...defaultParameters },
  },
]

export const modelsBoxList = [
  {
    value: 'gpt-3.5-turbo',
    label: 'OpenAI: GPT-3.5 Turbo',
  },
  {
    value: 'gpt-4',
    label: 'OpenAI: GPT-4',
  },
  {
    value: 'meta-llama/llama-2-70b-chat',
    label: 'Meta: Llama v2 70B Chat',
  },
  {
    value: 'jondurbin/airoboros-l2-70b',
    label: 'Airoboros L2 70B',
  },
  {
    value: 'migtissera/synthia-70b',
    label: 'Synthia 70B',
  },
  {
    value: 'xwin-lm/xwin-lm-70b',
    label: 'Xwin 70B',
  },
]
