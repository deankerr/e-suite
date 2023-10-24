import { OpenAIInferenceParameters } from '@/lib/providers'
import type { Message } from 'ai'
import type { OpenAI } from 'openai'

//# deprecate
export type ChatSession = {
  id: Readonly<string>
  api: {
    endpoint: string
  }
  panel: ChatPanelState
  parameters: ChatInferenceParameters
}
//# deprecate
export type ChatPanelState = {
  title: string
  active: boolean
}
//# deprecate
export type ChatInferenceParameters = {
  modelId: string
} & Partial<OpenAIInferenceParameters>

export type ChatMessage = Message & { hidden?: boolean }

export type InferenceParameters = Partial<OpenAIInferenceParameters>
