import { OpenAIInferenceParameters } from '@/lib/api/adapters/openai.schema'

export type ChatSession = {
  id: Readonly<string> // id
  name: string // unique
  engineId: string
  engineInput: Record<string, EngineInput>
}

export type EngineInput = Partial<OpenAIInferenceParameters> & {
  fieldsEnabled?: string[]
}
