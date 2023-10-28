import { OpenAIInferenceParameters } from '@/lib/platform'

export type ChatSession = {
  id: Readonly<string> // id
  name: string // unique
  modelId: string
  parameters: ChatSessionModelParameters
}

export type ChatSessionModelParameters = Partial<OpenAIInferenceParameters> & {
  fieldsEnabled?: string[]
}
