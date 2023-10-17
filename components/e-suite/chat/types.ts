import type { SchemaOpenAIChatRequest } from '@/lib/providers'
import type { Message } from 'ai'
import type { OpenAI } from 'openai'

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
} & ExcludeNullProps<OpenAI.Chat.ChatCompletionCreateParams>

export type ChatMessage = Message & { hidden?: boolean }

type ExcludeNullProps<T> = {
  [P in keyof T]: Exclude<T[P], null>
}
