import { OpenAIInferenceParameters } from '@/lib/api/adapters/openai.schema'

export type ChatSession = {
  id: Readonly<string> // id
  name: string // unique
  engineId: string
  engineInput: EngineInput
}

export type EngineInput = Partial<OpenAIInferenceParameters> & {
  fieldsEnabled?: string[]
}
