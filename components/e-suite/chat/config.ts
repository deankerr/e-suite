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
