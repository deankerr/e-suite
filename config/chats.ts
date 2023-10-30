import { ChatSession } from '@/components/chat/types'

export const chatsConfig: ChatSession[] = [
  {
    id: 'p1',
    name: 'Piñata',
    engineId: 'openrouter::meta-llama/llama-2-70b-chat',
    engineInput: {},
  },
  {
    id: 'g1',
    name: 'Gretchen',
    engineId: 'openai::gpt-3.5-turbo',
    engineInput: {},
  },
  {
    id: 'h1',
    name: 'Hideko',
    engineId: 'togetherai::togethercomputer/RedPajama-INCITE-7B-Chat',
    engineInput: {},
  },
]
