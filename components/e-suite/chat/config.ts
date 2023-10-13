import type { ChatInferenceParameters, ChatSession } from './types'

const defaultParameters: ChatInferenceParameters = {
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  stream: true,
}

export const chatsConfig: ChatSession[] = [
  {
    id: 'G2',
    panelTitle: 'Gretchen',
    panelActive: false,
    api: '/api/chat',
    parameters: { ...defaultParameters },
  },
  {
    id: 'H3',
    panelTitle: 'Hideko',
    panelActive: true,
    api: '/api/chat',
    parameters: { ...defaultParameters },
  },
  {
    id: 'P1',
    panelTitle: 'Piñata',
    panelActive: false,
    api: '/api/chat',
    parameters: { ...defaultParameters },
  },
  {
    id: 'E4',
    panelTitle: 'Ernest',
    panelActive: false,
    api: '/api/chat',
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
