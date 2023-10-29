import { OpenAIInferenceParameters } from '@/lib/platform/adapters/openai'

export type ChatSession = {
  id: Readonly<string> // id
  name: string // unique
  engineId: string
  parameters: ChatSessionModelParameters
}

export type ChatSessionModelParameters = Partial<OpenAIInferenceParameters> & {
  fieldsEnabled?: string[]
}
