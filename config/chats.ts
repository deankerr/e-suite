import { ChatSession } from '@/components/chat/types'

export const chatsConfig: ChatSession[] = [
  {
    id: 'p1',
    name: 'Piñata',
    modelId: 'openrouter::meta-llama/llama-2-70b-chat',
    parameters: {},
  },
  {
    id: 'g1',
    name: 'Gretchen',
    modelId: 'openai::gpt-4',
    parameters: {},
  },
  {
    id: 'e1',
    name: 'Ernest',
    modelId: 'openrouter::xwin-lm/xwin-lm-70b',
    parameters: {},
  },
  {
    id: 'h1',
    name: 'Hideko',
    modelId: 'openrouter::migtissera/synthia-70b',
    parameters: {},
  },
  {
    id: 'c1',
    name: 'Craig',
    modelId: 'openai::gpt-3.5-turbo',
    parameters: {},
  },
]
