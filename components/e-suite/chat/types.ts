import type { Message } from 'ai'

export type ChatSession = {
  id: string
  panelTitle: string
  panelActive: boolean
  api: string
  parameters: ChatInferenceParameters
}

export type ChatInferenceParameters = {
  provider: string
  model: string
  stream: boolean
}

export type ChatMessage = Message & { hidden?: boolean }
