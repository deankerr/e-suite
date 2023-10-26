import { OpenAIInferenceParameters } from '@/lib/providers'

export type ChatTabData = {
  id: Readonly<string> // id
  name: string // unique
  modelId: string
  parameters: ChatTabInferenceParameters
}

export type ChatTabInferenceParameters = Partial<OpenAIInferenceParameters> & {
  fieldsEnabled?: string[]
}
