import type { Message } from 'ai'

export type ChatSession = {
  id: Readonly<string>
  api: {
    endpoint: string
  }
  panel: ChatPanelState
  parameters: ChatInferenceParameters
}

export type ChatPanelState = {
  title: string
  active: boolean
}

export type ChatInferenceParameters = {
  provider: string
  model: string
  stream: boolean
}

export type ChatMessage = Message & { hidden?: boolean }

export type ChatModelOption = {
  provider: string
  model: string
  label: string
}
