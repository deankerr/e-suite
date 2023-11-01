import { ChatSession } from '@/components/chat/types'

export const chatsConfig: ChatSession[] = [
  {
    id: 'p1',
    name: 'Piñata',
    engineId: 'openrouter::airoboros-l2-70b',
    engineInput: {},
  },
  {
    id: 'g1',
    name: 'Gretchen',
    engineId: 'openai::gpt-4',
    engineInput: {},
  },
  {
    id: 'h1',
    name: 'Hideko',
    engineId: 'togetherai::dolly-v2-12b',
    engineInput: {},
  },
]
